import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { LikeSchema } from './entities/like.entity';
import { CommentSchema } from '../comment/entities/comment.entity';
import { AuthModule } from '../auth/auth.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Like', schema: LikeSchema },
      { name: 'Comment', schema: CommentSchema },
    ]),
    AuthModule,
    forwardRef(() => CommentModule),
  ],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService, CommentModule],
})
export class LikesModule {}
