import { PartialType } from '@nestjs/mapped-types';
import { CreateWebsocketGatewayDto } from './create-websocket-gateway.dto';

export class UpdateWebsocketGatewayDto extends PartialType(CreateWebsocketGatewayDto) {}
