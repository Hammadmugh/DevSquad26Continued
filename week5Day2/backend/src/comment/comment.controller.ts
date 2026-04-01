import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../user/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @Auth()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentService.create(
      createCommentDto,
      user._id.toString(),
    );
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Get(':id/replies')
  getReplies(@Param('id') id: string) {
    return this.commentService.getReplies(id);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentService.update(
      id,
      updateCommentDto,
      user._id.toString(),
    );
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.commentService.remove(id, user._id.toString());
  }

  @Post(':id/replies')
  @Auth()
  addReply(
    @Param('id') id: string,
    @Body() body: { content: string },
    @CurrentUser() user: User,
  ) {
    return this.commentService.addReply(
      id,
      body.content,
      user._id.toString(),
    );
  }

  @Post(':id/like')
  @Auth()
  likeComment(@Param('id') id: string, @CurrentUser() user: User) {
    return this.commentService.likeComment(id, user._id.toString());
  }

  @Post(':id/unlike')
  @Auth()
  unlikeComment(@Param('id') id: string, @CurrentUser() user: User) {
    return this.commentService.unlikeComment(id, user._id.toString());
  }
}
