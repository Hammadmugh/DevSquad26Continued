import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { CommentService } from '../comment/comment.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { User } from '../user/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('likes')
export class LikesController {
  constructor(
    private readonly likesService: LikesService,
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
  ) {}

  @Post()
  @Auth()
  like(@Body() createLikeDto: CreateLikeDto, @CurrentUser() user: User) {
    // Use CommentService.likeComment to ensure notifications are sent
    return this.commentService.likeComment(
      createLikeDto.commentId.toString(),
      user._id.toString(),
    );
  }

  @Delete(':commentId')
  @Auth()
  unlike(@Param('commentId') commentId: string, @CurrentUser() user: User) {
    return this.likesService.unlikeComment(commentId, user._id.toString());
  }

  @Get(':commentId/is-liked')
  @Auth()
  isLiked(
    @Param('commentId') commentId: string,
    @CurrentUser() user: User,
  ) {
    return this.likesService.isLiked(commentId, user._id.toString());
  }

  @Get(':commentId')
  getCommentLikes(@Param('commentId') commentId: string) {
    return this.likesService.getCommentLikes(commentId);
  }
}
