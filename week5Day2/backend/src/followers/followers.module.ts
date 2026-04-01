import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowersService } from './followers.service';
import { FollowersController } from './followers.controller';
import { FollowerSchema } from './entities/follower.entity';
import { UserSchema } from '../user/entities/user.entity';
import { NotificationModule } from '../notification/notification.module';
import { AuthModule } from '../auth/auth.module';
import { WebsocketGatewayModule } from '../websocket-gateway/websocket-gateway.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Follower', schema: FollowerSchema },
      { name: 'User', schema: UserSchema },
    ]),
    forwardRef(() => NotificationModule),
    AuthModule,
    WebsocketGatewayModule,
  ],
  controllers: [FollowersController],
  providers: [FollowersService],
  exports: [FollowersService],
})
export class FollowersModule {}
