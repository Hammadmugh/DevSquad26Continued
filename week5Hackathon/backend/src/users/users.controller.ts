import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /* ── Public: fetch a user's basic info for top-bidder display ── */
  @Get(':id/public')
  getPublicProfile(@Param('id') id: string) {
    return this.usersService.getPublicProfile(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: { user: { userId: string } }) {
    return this.usersService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  updateProfile(
    @Request() req: { user: { userId: string } },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/wishlist')
  getWishlist(@Request() req: { user: { userId: string } }) {
    return this.usersService.getWishlist(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/wishlist/:auctionId')
  addToWishlist(
    @Request() req: { user: { userId: string } },
    @Param('auctionId') auctionId: string,
  ) {
    return this.usersService.addToWishlist(req.user.userId, auctionId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/wishlist/:auctionId')
  removeFromWishlist(
    @Request() req: { user: { userId: string } },
    @Param('auctionId') auctionId: string,
  ) {
    return this.usersService.removeFromWishlist(req.user.userId, auctionId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/cars')
  getMyCars(@Request() req: { user: { userId: string } }) {
    return this.usersService.getMyCars(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/bids')
  getMyBids(@Request() req: { user: { userId: string } }) {
    return this.usersService.getMyBids(req.user.userId);
  }
}
