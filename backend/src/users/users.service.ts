import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRole, UserStatus, Prisma, VerificationStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const { documents, ...userData } = createUserDto;

    const documentData = documents ? {
      documents: {
        create: [
          documents.idCard && {
            type: 'ID_CARD',
            url: documents.idCard,
            status: 'PENDING'
          },
          documents.medicalCertificate && {
            type: 'MEDICAL_CERTIFICATE',
            url: documents.medicalCertificate,
            status: 'PENDING'
          },
          documents.policeClearance && {
            type: 'POLICE_CLEARANCE',
            url: documents.policeClearance,
            status: 'PENDING'
          },
          documents.referenceLetter && {
            type: 'REFERENCE_LETTER',
            url: documents.referenceLetter,
            status: 'PENDING'
          },
          documents.educationCertificate && {
            type: 'EDUCATION_CERTIFICATE',
            url: documents.educationCertificate,
            status: 'PENDING'
          }
        ].filter(Boolean)
      }
    } : {};

    return this.prisma.user.create({
      data: {
        ...userData,
        fullName: `${userData.firstName} ${userData.lastName}`,
        password: hashedPassword,
        status: UserStatus.PENDING,
        ...documentData
      },
      include: {
        documents: true
      }
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { documents: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: any): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findPendingMaids(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        role: UserRole.MAID,
        status: UserStatus.PENDING_APPROVAL,
      },
      include: {
        documents: true,
        maidProfile: true,
      },
    });
  }

  async approveMaid(id: string): Promise<User> {
    const user = await this.findOne(id);

    if (user.status !== UserStatus.PENDING_APPROVAL) {
      throw new BadRequestException('User is not pending approval');
    }

    // Update all user's documents to approved
    await this.prisma.document.updateMany({
      where: { userId: id },
      data: { status: 'approved' },
    });

    return this.prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.ACTIVE,
      },
      include: {
        documents: true,
        maidProfile: true,
      },
    });
  }

  async rejectMaid(id: string): Promise<User> {
    const user = await this.findOne(id);

    if (user.status !== UserStatus.PENDING_APPROVAL) {
      throw new BadRequestException('User is not pending approval');
    }

    // Update all user's documents to rejected
    await this.prisma.document.updateMany({
      where: { userId: id },
      data: { status: 'rejected' },
    });

    return this.prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.REJECTED,
      },
      include: {
        documents: true,
        maidProfile: true,
      },
    });
  }

  async findMaids(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        role: UserRole.MAID,
        status: UserStatus.ACTIVE,
      },
      include: {
        maidProfile: true,
      },
    });
  }

  async registerMaid(data: any): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: UserRole.MAID,
        status: UserStatus.PENDING_APPROVAL,
        fullName: `${data.firstName} ${data.lastName}`,
        maidProfile: {
          create: {
            photoUrl: data.photoUrl,
          },
        },
        documents: {
          createMany: {
            data: [
              {
                type: 'NATIONAL_ID',
                url: data.documents.national_id,
                status: 'pending',
              },
              {
                type: 'POLICE_CLEARANCE',
                url: data.documents.police_clearance,
                status: 'pending',
              },
            ],
          },
        },
      },
      include: {
        maidProfile: true,
        documents: true,
      },
    });
  }

  async getPendingApprovals(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        status: UserStatus.PENDING_APPROVAL,
      },
      include: {
        documents: true,
        maidProfile: true,
      },
    });
  }

  async approveUser(id: string): Promise<User> {
    return this.approveMaid(id);
  }

  async rejectUser(id: string, reason: string): Promise<User> {
    const user = await this.findOne(id);

    if (user.status !== UserStatus.PENDING_APPROVAL) {
      throw new BadRequestException('User is not pending approval');
    }

    // Since we don't have a rejectionReason field, we'll just update the status
    return this.prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.REJECTED,
        verificationStatus: VerificationStatus.REJECTED,
      },
      include: {
        documents: true,
        maidProfile: true,
      },
    });
  }
}
