import { Module } from '@nestjs/common';
import { CommentsGateway } from './comments.gateway';
import { CommentsService } from './comments.service';

@Module({
  imports: [],
  providers: [CommentsService, CommentsGateway],
})
export class AppModule {}
