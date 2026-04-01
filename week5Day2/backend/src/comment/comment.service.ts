import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/dto/create-notification.dto';
import { User } from '../user/entities/user.entity';
import { ChatGateway } from '../websocket-gateway/chat.gateway';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private commentModel: Model<Comment>,
    @InjectModel('User') private userModel: Model<User>,
    private notificationService: NotificationService,
    private chatGateway: ChatGateway,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: string) {
    const comment = await this.commentModel.create({
      author: userId,
      content: createCommentDto.content,
      likes: 0,
      likedBy: [],
      replies: [],
    });

    return comment.populate('author', 'username profilePicture email');
  }

  async findAll() {
    return this.commentModel
      .find()
      .populate('author', 'username profilePicture email')
      .populate('replies.author', 'username profilePicture email')
      .sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const comment = await this.commentModel
      .findById(id)
      .populate('author', 'username profilePicture email')
      .populate('replies.author', 'username profilePicture email');

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string) {
    const comment = await this.commentModel.findById(id);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.author.toString() !== userId) {
      throw new BadRequestException('Unauthorized');
    }

    comment.content = updateCommentDto.content || comment.content;
    await comment.save();

    return this.commentModel
      .findById(id)
      .populate('author', 'username profilePicture email')
      .populate('replies.author', 'username profilePicture email');
  }

  async remove(id: string, userId: string) {
    const comment = await  this.commentModel.findById(id);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.author.toString() !== userId) {
      throw new BadRequestException('Unauthorized');
    }

    return this.commentModel.findByIdAndDelete(id);
  }

  async addReply(
    commentId: string,
    content: string,
    userId: string,
  ) {
    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const reply = {
      author: new Types.ObjectId(userId),
      content,
      likes: 0,
      likedBy: [],
      createdAt: new Date(),
    };

    comment.replies.push(reply);
    await comment.save();

    // Fetch user info for notification message
    const user = await this.userModel.findById(userId);
    const commentAuthor = await this.userModel.findById(comment.author);

    // Ensure comment.author is in ObjectId format
    const authorId = comment.author instanceof Types.ObjectId
      ? comment.author
      : new Types.ObjectId(comment.author);

    // Create and send notification
    const notification = await this.notificationService.create({
      recipient: authorId,
      sender: new Types.ObjectId(userId),
      type: NotificationType.REPLY,
      message: `${user?.username || 'Someone'} replied to ${commentAuthor?.username || 'your'} comment`,
      commentId: comment._id,
    });

    // Emit real-time notification to the recipient
    this.chatGateway.sendNotificationToUser(
      authorId.toString(),
      notification,
    );

    return this.commentModel
      .findById(comment._id)
      .populate('author', 'username profilePicture email')
      .populate('replies.author', 'username profilePicture email');
  }

  async getReplies(commentId: string) {
    const comment = await this.commentModel
      .findById(commentId)
      .populate('replies.author', 'username profilePicture email');

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment.replies;
  }

  async likeComment(commentId: string, userId: string) {
    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const userIdObj = new Types.ObjectId(userId);
    const alreadyLiked = comment.likedBy.some((id) =>
      id.equals(userIdObj),
    );

    if (alreadyLiked) {
      throw new BadRequestException('Already liked');
    }

    comment.likedBy.push(userIdObj);
    comment.likes = comment.likedBy.length;
    await comment.save();

    // Fetch user info for notification message
    const user = await this.userModel.findById(userId);
    const commentAuthor = await this.userModel.findById(comment.author);

    // Ensure comment.author is in ObjectId format
    const authorId = comment.author instanceof Types.ObjectId
      ? comment.author
      : new Types.ObjectId(comment.author);

    // Create and send notification
    const notification = await this.notificationService.create({
      recipient: authorId,
      sender: userIdObj,
      type: NotificationType.LIKE,
      message: `${user?.username || 'Someone'} liked ${commentAuthor?.username || 'your'} comment`,
      commentId: comment._id,
    });

    // Emit real-time notification to the recipient
    this.chatGateway.sendNotificationToUser(
      authorId.toString(),
      notification,
    );

    return this.commentModel
      .findById(comment._id)
      .populate('author', 'username profilePicture email')
      .populate('replies.author', 'username profilePicture email');
  }

  async unlikeComment(commentId: string, userId: string) {
    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const userIdObj = new Types.ObjectId(userId);
    comment.likedBy = comment.likedBy.filter(
      (id) => !id.equals(userIdObj),
    );
    comment.likes = comment.likedBy.length;
    await comment.save();

    return this.commentModel
      .findById(comment._id)
      .populate('author', 'username profilePicture email')
      .populate('replies.author', 'username profilePicture email');
  }
}
