import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentSchema } from './entities/comment.entity';
import { UserSchema } from '../user/entities/user.entity';
import { NotificationModule } from '../notification/notification.module';
import { AuthModule } from '../auth/auth.module';
import { WebsocketGatewayModule } from '../websocket-gateway/websocket-gateway.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Comment', schema: CommentSchema },
      { name: 'User', schema: UserSchema },
    ]),
    forwardRef(() => NotificationModule),
    AuthModule,
    WebsocketGatewayModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
