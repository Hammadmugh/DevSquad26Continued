import { Controller, Post, Get, Param, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthRequest extends Request {
  user: { userId: string };
}

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':auctionId')
  @UseGuards(JwtAuthGuard)
  pay(@Param('auctionId') auctionId: string, @Request() req: AuthRequest) {
    return this.paymentsService.pay(auctionId, req.user.userId);
  }

  @Get(':auctionId/status')
  getStatus(@Param('auctionId') auctionId: string) {
    return this.paymentsService.getStatus(auctionId);
  }
}
