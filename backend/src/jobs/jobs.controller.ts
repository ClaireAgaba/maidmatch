import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('jobs')
@Controller('jobs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new job posting' })
  @ApiResponse({ status: 201, description: 'Job successfully created' })
  create(@Request() req, @Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all jobs' })
  findAll(@Query() filters: any) {
    return this.jobsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific job' })
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a job posting' })
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(id, updateJobDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a job posting' })
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }

  @Post(':id/apply')
  @ApiOperation({ summary: 'Apply for a job' })
  apply(@Param('id') id: string, @Request() req) {
    return this.jobsService.apply(id, req.user.userId);
  }

  @Post(':id/hire/:maidId')
  @ApiOperation({ summary: 'Hire a maid for a job' })
  hire(@Param('id') id: string, @Param('maidId') maidId: string) {
    return this.jobsService.hire(id, maidId);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark a job as completed' })
  complete(@Param('id') id: string) {
    return this.jobsService.complete(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a job' })
  cancel(@Param('id') id: string) {
    return this.jobsService.cancel(id);
  }
}
