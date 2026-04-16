import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/review.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('products/:productId/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /** GET /api/products/:productId/reviews */
  @Get()
  findAll(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(productId);
  }

  /** POST /api/products/:productId/reviews — authenticated users only */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('productId') productId: string,
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(productId, user.sub, dto);
  }
}
