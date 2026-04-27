import {
  Controller,
  Get,
  Request,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get('global')
  async joinGlobalConversation(@Request() req) {
    const userId = req.user.sub;

    return await this.conversationService.joinGlobalConversation(userId);
  }
}
