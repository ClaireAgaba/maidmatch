import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review successfully created' })
  create(@Body() createReviewDto: CreateReviewDto, @Req() req: any) {
    return this.reviewsService.create(
      req.user.userId,
      createReviewDto.maidId,
      createReviewDto.rating,
      createReviewDto.comment
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get('maid/:maidId')
  @ApiOperation({ summary: 'Get reviews for a specific maid' })
  findByMaid(@Param('maidId') maidId: string) {
    return this.reviewsService.findByMaid(maidId);
  }

  @Get('reviewer/:userId')
  @ApiOperation({ summary: 'Get reviews for a specific reviewer' })
  findByReviewer(@Param('userId') userId: string) {
    return this.reviewsService.findByReviewer(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific review' })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a review' })
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(
      id,
      updateReviewDto.rating,
      updateReviewDto.comment
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a review' })
  delete(@Param('id') id: string) {
    return this.reviewsService.delete(id);
  }

  @Get('average/:maidId')
  @ApiOperation({ summary: 'Get average rating for a maid' })
  getAverageRating(@Param('maidId') maidId: string) {
    return this.reviewsService.getAverageRating(maidId);
  }
}
