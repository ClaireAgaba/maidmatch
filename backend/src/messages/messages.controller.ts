import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new message' })
  create(@Request() req, @Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all messages for the current user' })
  findAll(@Request() req) {
    return this.messagesService.getUserMessages(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific message' })
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark a message as read' })
  markAsRead(@Param('id') id: string) {
    return this.messagesService.markAsRead(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a message' })
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }

  @Get('conversation/:userId')
  @ApiOperation({ summary: 'Get conversation with another user' })
  getConversation(@Request() req, @Param('userId') userId: string) {
    return this.messagesService.getConversation(req.user.id, userId);
  }

  @Get('unread/count')
  @ApiOperation({ summary: 'Get count of unread messages' })
  getUnreadCount(@Request() req) {
    return this.messagesService.getUnreadCount(req.user.id);
  }
}
