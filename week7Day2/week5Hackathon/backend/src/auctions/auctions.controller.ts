import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto, PlaceBidDto, AuctionQueryDto } from './dto/auction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  /* Public routes */
  @Get()
  findAll(@Query() query: AuctionQueryDto) {
    return this.auctionsService.findAll(query);
  }

  @Get('live')
  findLive() {
    return this.auctionsService.findLive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auctionsService.findOne(id);
  }

  @Get(':id/bids')
  getBids(@Param('id') id: string) {
    return this.auctionsService.getBids(id);
  }

  /* Protected routes */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() dto: CreateAuctionDto,
    @Request() req: { user: { userId: string } },
  ) {
    return this.auctionsService.create(dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateAuctionDto>,
    @Request() req: { user: { userId: string } },
  ) {
    return this.auctionsService.update(id, dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: { user: { userId: string } },
  ) {
    return this.auctionsService.remove(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/end')
  endBid(
    @Param('id') id: string,
    @Request() req: { user: { userId: string } },
  ) {
    return this.auctionsService.endBid(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/bids')
  placeBid(
    @Param('id') id: string,
    @Body() dto: PlaceBidDto,
    @Request() req: { user: { userId: string } },
  ) {
    return this.auctionsService.placeBid(id, dto, req.user.userId);
  }
}
