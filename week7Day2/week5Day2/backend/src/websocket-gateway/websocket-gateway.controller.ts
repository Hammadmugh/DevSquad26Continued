import { Controller } from '@nestjs/common';
import { WebsocketGatewayService } from './websocket-gateway.service';

@Controller('websocket-gateway')
export class WebsocketGatewayController {
  constructor(
    private readonly websocketGatewayService: WebsocketGatewayService,
  ) {}
}
