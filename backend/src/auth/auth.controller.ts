import { Controller, Post, Body, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('register-maid')
  @ApiOperation({ summary: 'Register a new maid with documents' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Maid successfully registered' })
  @ApiResponse({ status: 400, description: 'Invalid input or missing files' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profilePhoto', maxCount: 1 },
        { name: 'id', maxCount: 1 },
        { name: 'medicalCertificate', maxCount: 1 },
        { name: 'policeLetter', maxCount: 1 },
        { name: 'referenceLetter', maxCount: 1 },
        { name: 'educationCertificate', maxCount: 1 },
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
        fileFilter: (req, file, cb) => {
          if (file.fieldname === 'profilePhoto') {
            if (!file.mimetype.includes('image/')) {
              return cb(new BadRequestException('Profile photo must be an image file'), false);
            }
          } else {
            if (file.mimetype !== 'application/pdf') {
              return cb(new BadRequestException('Documents must be PDF files'), false);
            }
          }
          if (file.size > 2 * 1024 * 1024) { // 2MB
            return cb(new BadRequestException('File size must not exceed 2MB'), false);
          }
          cb(null, true);
        },
      },
    ),
  )
  async registerMaid(
    @Body() userData: string,
    @UploadedFiles() files: { 
      profilePhoto?: Express.Multer.File[],
      id?: Express.Multer.File[],
      medicalCertificate?: Express.Multer.File[],
      policeLetter?: Express.Multer.File[],
      referenceLetter?: Express.Multer.File[],
      educationCertificate?: Express.Multer.File[],
    },
  ) {
    if (!files.profilePhoto) {
      throw new BadRequestException('Profile photo is required');
    }

    const requiredDocuments = ['id', 'medicalCertificate', 'policeLetter', 'referenceLetter'];
    for (const doc of requiredDocuments) {
      if (!files[doc]) {
        throw new BadRequestException(`${doc} document is required`);
      }
    }

    let createUserDto: CreateUserDto;
    try {
      createUserDto = JSON.parse(userData);
    } catch (error) {
      throw new BadRequestException('Invalid user data format');
    }

    // Update document URLs
    createUserDto.documents = {
      idCard: files.id[0].path,
      medicalCertificate: files.medicalCertificate[0].path,
      policeClearance: files.policeLetter[0].path,
      referenceLetter: files.referenceLetter ? files.referenceLetter[0].path : undefined,
      educationCertificate: files.educationCertificate ? files.educationCertificate[0].path : undefined,
    };

    // Update education background
    if (files.educationCertificate) {
      createUserDto.educationBackground = {
        ...createUserDto.educationBackground,
        level: createUserDto.educationBackground?.level || '',
        institution: createUserDto.educationBackground?.institution || '',
        yearCompleted: createUserDto.educationBackground?.yearCompleted || '',
        specialization: createUserDto.educationBackground?.specialization,
      };
    }

    createUserDto.profilePhotoUrl = files.profilePhoto[0].path;
    createUserDto.role = 'MAID';

    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
