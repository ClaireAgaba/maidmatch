import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message, Prisma } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(createMessageDto: CreateMessageDto, senderId: string): Promise<Message> {
    const { receiverId, content } = createMessageDto;
    return this.prisma.message.create({
      data: {
        content,
        sender: {
          connect: { id: senderId }
        },
        receiver: {
          connect: { id: receiverId }
        }
      },
      include: {
        sender: true,
        receiver: true
      }
    });
  }

  async findAll(filters: Partial<Prisma.MessageWhereInput> = {}): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: filters,
      include: {
        sender: true,
        receiver: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(id: string): Promise<Message> {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: {
        sender: true,
        receiver: true
      }
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return message;
  }

  async markAsRead(id: string): Promise<Message> {
    try {
      return await this.prisma.message.update({
        where: { id },
        data: {
          read: true
        },
        include: {
          sender: true,
          receiver: true
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Message with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Message> {
    try {
      return await this.prisma.message.delete({
        where: { id }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Message with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: {
        OR: [
          {
            AND: [
              { senderId: userId1 },
              { receiverId: userId2 }
            ]
          },
          {
            AND: [
              { senderId: userId2 },
              { receiverId: userId1 }
            ]
          }
        ]
      },
      include: {
        sender: true,
        receiver: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
  }

  async getUserMessages(userId: string): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: true,
        receiver: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.message.count({
      where: {
        receiverId: userId,
        read: false
      }
    });
  }
}
