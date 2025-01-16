import { Controller, Get, Post, Put, Body, Param, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as express from 'express';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('maids/all')
  findMaids() {
    return this.usersService.findMaids();
  }

  @Post('maid-registration')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'photo', maxCount: 1 },
        { name: 'national_id', maxCount: 1 },
        { name: 'medical_certificate', maxCount: 1 },
        { name: 'police_clearance', maxCount: 1 },
        { name: 'reference_letter', maxCount: 1 },
        { name: 'education_certificates', maxCount: 5 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            return cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
        limits: {
          fileSize: 10 * 1024 * 1024, // 10MB
        },
        fileFilter: (req, file, cb) => {
          const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'application/pdf',
          ];
          
          if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
          } else {
            cb(new Error('Invalid file type. Only JPEG, PNG and PDF files are allowed.'), false);
          }
        },
      },
    ),
  )
  async registerMaid(
    @Body() registrationData: any,
    @UploadedFiles()
    files: {
      photo?: Express.Multer.File[];
      national_id?: Express.Multer.File[];
      medical_certificate?: Express.Multer.File[];
      police_clearance?: Express.Multer.File[];
      reference_letter?: Express.Multer.File[];
      education_certificates?: Express.Multer.File[];
    },
  ) {
    try {
      console.log('Received registration data:', registrationData);
      console.log('Received files:', files);

      const photoPath = files.photo?.[0]?.path;
      const nationalIdPath = files.national_id?.[0]?.path;
      const medicalCertificatePath = files.medical_certificate?.[0]?.path;
      const policeClearancePath = files.police_clearance?.[0]?.path;
      const referenceLetterPath = files.reference_letter?.[0]?.path;
      const educationCertificatePaths = files.education_certificates?.map(file => file.path) || [];

      if (!photoPath || !nationalIdPath || !medicalCertificatePath || !policeClearancePath) {
        throw new Error('Missing required files: photo, national ID, medical certificate, and police clearance are required');
      }

      return this.usersService.registerMaid({
        ...registrationData,
        photoUrl: photoPath,
        documents: {
          nationalId: nationalIdPath,
          medicalCertificate: medicalCertificatePath,
          policeClearance: policeClearancePath,
          referenceLetter: referenceLetterPath,
          educationCertificates: educationCertificatePaths,
        },
      });
    } catch (error) {
      console.error('Error in registerMaid:', error);
      throw error;
    }
  }

  @Get('pending-approvals')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pending user approvals' })
  @ApiResponse({ status: 200, description: 'List of pending approvals' })
  async getPendingApprovals() {
    return this.usersService.getPendingApprovals();
  }

  @Get('pending-maids')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getPendingMaids(): Promise<any> {
    return this.usersService.findPendingMaids();
  }

  @Post('approve/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async approveMaid(@Param('id') id: string): Promise<any> {
    return this.usersService.approveMaid(id);
  }

  @Post('reject/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async rejectMaid(@Param('id') id: string): Promise<any> {
    return this.usersService.rejectMaid(id);
  }

  @Put(':id/approve')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve a user' })
  @ApiResponse({ status: 200, description: 'User approved successfully' })
  async approveUser(@Param('id') id: string) {
    return this.usersService.approveUser(id);
  }

  @Put(':id/reject')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a user' })
  @ApiResponse({ status: 200, description: 'User rejected successfully' })
  async rejectUser(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.usersService.rejectUser(id, reason);
  }
}
