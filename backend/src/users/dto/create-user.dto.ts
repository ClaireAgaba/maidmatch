import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsObject,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class Language {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  proficiency: string;
}

export class Location {
  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  district: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  country: string;
}

export class NextOfKin {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  relationship: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  address: string;
}

export class MedicalHistory {
  @ApiProperty()
  @IsArray()
  allergies: string[];

  @ApiProperty()
  @IsArray()
  chronicDiseases: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  bloodType?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  vaccinations?: string[];
}

export class EducationBackground {
  @ApiProperty()
  @IsString()
  level: string;

  @ApiProperty()
  @IsString()
  institution: string;

  @ApiProperty()
  @IsString()
  yearCompleted: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  specialization?: string;
}

export class Documents {
  @ApiProperty()
  @IsString()
  idCard: string;

  @ApiProperty()
  @IsString()
  medicalCertificate: string;

  @ApiProperty()
  @IsString()
  policeClearance: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  referenceLetter?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  educationCertificate?: string;
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  // Maid specific fields
  @ApiProperty()
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  tribe?: string;

  @ApiProperty({ type: [Language] })
  @IsOptional()
  @IsArray()
  languages?: Language[];

  @ApiProperty()
  @IsOptional()
  @IsObject()
  currentAddress?: Location;

  @ApiProperty({ type: [String] })
  @IsOptional()
  @IsArray()
  skills?: string[];

  @ApiProperty()
  @IsOptional()
  @IsObject()
  nextOfKin?: NextOfKin;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  medicalHistory?: MedicalHistory;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  educationBackground?: EducationBackground;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  documents?: Documents;

  @ApiProperty()
  @IsOptional()
  @IsString()
  profilePhotoUrl?: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;
}
