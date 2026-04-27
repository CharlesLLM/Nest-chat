import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from 'src/conversation/dto/create-message.dto';
import { MessagesGateway } from 'src/messages/messages.gateway';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ConversationService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => MessagesGateway))
    private readonly messagesGateway: MessagesGateway,
  ) {}

  async getGlobalConversation() {
    return this.prismaService.conversation.findFirst({
      where: {
        name: 'Global',
      },
    });
  }

  async createGlobalConversation() {
    return this.prismaService.conversation.create({
      data: {
        name: 'Global',
      },
    });
  }

  async joinGlobalConversation(userId: string) {
    let globalConversation = await this.getGlobalConversation();
    if (!globalConversation) {
      globalConversation = await this.createGlobalConversation();
    }

    const conversationMember = await this.prismaService.conversationMember.findUnique({
      where: {
        userId_conversationId: {
          userId,
          conversationId: globalConversation.id,
        },
      },
    });

    if (conversationMember) {
      throw new ConflictException('User is already a member of the global conversation');
    }

    await this.prismaService.conversationMember.create({
      data: {
        userId,
        conversationId: globalConversation.id,
      },
    });

    return globalConversation;
  }

  async createMessage(createMessageDto: CreateMessageDto) {
    const conversationMember = await this.prismaService.conversationMember.findUnique({
      where: {
        userId_conversationId: {
          userId: createMessageDto.userId,
          conversationId: createMessageDto.conversationId,
        },
      },
    });

    if (!conversationMember) {
      throw new NotFoundException('User is not a member of this conversation');
    }

    const message = await this.prismaService.message.create({
      data: {
        content: createMessageDto.content,
        conversationId,
        userId,
      },
    });

    await this.messagesGateway.handleNewMessage(conversationId, message);

    return message;
  }
}
