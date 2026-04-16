import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebsocketGateway } from './entities/websocket-gateway.entity';
import { CreateWebsocketGatewayDto } from './dto/create-websocket-gateway.dto';

@Injectable()
export class WebsocketGatewayService {
  constructor(
    @InjectModel('WebsocketGateway')
    private websocketModel: Model<WebsocketGateway>,
  ) {}

  async create(createWebsocketGatewayDto: CreateWebsocketGatewayDto) {
    return this.websocketModel.create(createWebsocketGatewayDto);
  }

  async findByUserId(userId: string) {
    return this.websocketModel.findOne({ user: userId, isConnected: true });
  }

  async updateLastActivity(userId: string) {
    return this.websocketModel.updateOne(
      { user: userId },
      { lastActivity: new Date() },
    );
  }

  async disconnect(socketId: string) {
    return this.websocketModel.updateOne(
      { socketId },
      { isConnected: false },
    );
  }

  async deleteBySocketId(socketId: string) {
    return this.websocketModel.deleteOne({ socketId });
  }
}
