import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { WebsocketGatewayService } from './websocket-gateway.service';
import { WebsocketGatewayController } from './websocket-gateway.controller';
import { WebsocketGatewaySchema } from './entities/websocket-gateway.entity';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'WebsocketGateway', schema: WebsocketGatewaySchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret-key',
    }),
  ],
  controllers: [WebsocketGatewayController],
  providers: [WebsocketGatewayService, ChatGateway],
  exports: [ChatGateway],
})
export class WebsocketGatewayModule {}
