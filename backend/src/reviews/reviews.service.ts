import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Review } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(
    reviewerId: string,
    maidId: string,
    rating: number,
    comment?: string,
  ): Promise<Review> {
    return this.prisma.review.create({
      data: {
        rating,
        comment,
        reviewer: {
          connect: { id: reviewerId },
        },
        maid: {
          connect: { id: maidId },
        },
      },
      include: {
        reviewer: true,
        maid: true,
      },
    });
  }

  async findAll(): Promise<Review[]> {
    return this.prisma.review.findMany({
      include: {
        reviewer: true,
        maid: true,
      },
    });
  }

  async findOne(id: string): Promise<Review | null> {
    return this.prisma.review.findUnique({
      where: { id },
      include: {
        reviewer: true,
        maid: true,
      },
    });
  }

  async update(
    id: string,
    rating: number,
    comment?: string,
  ): Promise<Review> {
    return this.prisma.review.update({
      where: { id },
      data: {
        rating,
        comment,
      },
      include: {
        reviewer: true,
        maid: true,
      },
    });
  }

  async delete(id: string): Promise<Review> {
    return this.prisma.review.delete({
      where: { id },
    });
  }

  async findByMaid(maidId: string): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: {
        maidId,
      },
      include: {
        reviewer: true,
        maid: true,
      },
    });
  }

  async findByReviewer(userId: string): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: {
        reviewerId: userId,
      },
      include: {
        reviewer: true,
        maid: true,
      },
    });
  }

  async getAverageRating(maidId: string): Promise<number> {
    const result = await this.prisma.review.aggregate({
      where: {
        maidId,
      },
      _avg: {
        rating: true,
      },
    });

    return result._avg.rating || 0;
  }
}
