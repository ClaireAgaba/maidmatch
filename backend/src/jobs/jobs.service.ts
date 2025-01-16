import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job, JobStatus, Prisma } from '@prisma/client';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async create(createJobDto: CreateJobDto, posterId: string): Promise<Job> {
    return this.prisma.job.create({
      data: {
        ...createJobDto,
        status: JobStatus.OPEN,
        poster: {
          connect: { id: posterId }
        }
      },
      include: {
        poster: true,
        applications: {
          include: {
            maid: true,
            user: true
          }
        }
      }
    });
  }

  async findAll(filters: Partial<Prisma.JobWhereInput> = {}): Promise<Job[]> {
    return this.prisma.job.findMany({
      where: filters,
      include: {
        poster: true,
        applications: {
          include: {
            maid: true,
            user: true
          }
        }
      }
    });
  }

  async findOne(id: string): Promise<Job> {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        poster: true,
        applications: {
          include: {
            maid: true,
            user: true
          }
        }
      }
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto): Promise<Job> {
    try {
      return await this.prisma.job.update({
        where: { id },
        data: updateJobDto,
        include: {
          poster: true,
          applications: {
            include: {
              maid: true,
              user: true
            }
          }
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Job with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Job> {
    try {
      return await this.prisma.job.delete({
        where: { id }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Job with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async apply(jobId: string, maidId: string): Promise<Job> {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        applications: true
      }
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }
    
    if (job.status !== JobStatus.OPEN) {
      throw new BadRequestException('This job is not open for applications');
    }

    const existingApplication = await this.prisma.jobApplication.findFirst({
      where: {
        jobId,
        maidId
      }
    });

    if (existingApplication) {
      throw new BadRequestException('You have already applied to this job');
    }

    return this.prisma.job.update({
      where: { id: jobId },
      data: {
        applications: {
          create: {
            maidId,
            userId: maidId, // Since the maid is also a user
            status: 'pending'
          }
        }
      },
      include: {
        poster: true,
        applications: {
          include: {
            maid: true,
            user: true
          }
        }
      }
    });
  }

  async hire(jobId: string, maidId: string): Promise<Job> {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        applications: true
      }
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }
    
    if (job.status !== JobStatus.OPEN) {
      throw new BadRequestException('This job is not open for hiring');
    }

    const application = await this.prisma.jobApplication.findFirst({
      where: {
        jobId,
        maidId
      }
    });

    if (!application) {
      throw new BadRequestException('This maid has not applied to this job');
    }

    return this.prisma.job.update({
      where: { id: jobId },
      data: {
        status: JobStatus.IN_PROGRESS,
        applications: {
          updateMany: {
            where: { maidId },
            data: { status: 'accepted' }
          }
        }
      },
      include: {
        poster: true,
        applications: {
          include: {
            maid: true,
            user: true
          }
        }
      }
    });
  }

  async complete(jobId: string): Promise<Job> {
    const job = await this.findOne(jobId);
    
    if (job.status !== JobStatus.IN_PROGRESS) {
      throw new BadRequestException('This job is not in progress');
    }

    return this.prisma.job.update({
      where: { id: jobId },
      data: {
        status: JobStatus.COMPLETED
      },
      include: {
        poster: true,
        applications: {
          include: {
            maid: true,
            user: true
          }
        }
      }
    });
  }

  async cancel(jobId: string): Promise<Job> {
    return this.prisma.job.update({
      where: { id: jobId },
      data: {
        status: JobStatus.CANCELLED
      },
      include: {
        poster: true,
        applications: {
          include: {
            maid: true,
            user: true
          }
        }
      }
    });
  }
}
