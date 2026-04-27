import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { ConversationService } from 'src/conversation/conversation.service';

@WebSocketGateway(3005, { cors: { origin: '*' } })
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly conversationService: ConversationService) {}

  handleConnection(client: any) {
    client.broadcast.emit('user-joined', {
      message: `User joined the chat: ${client.id}`,
      clientId: client.id,
    });
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.server.emit('user-left', {
      message: `User left the chat: ${client.id}`,
      clientId: client.id,
    });
  }

  @SubscribeMessage('newMessage')
  async handleNewMessage(
    @MessageBody() data: { conversationId: string; message: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const globalConversation = await this.conversationService.getGlobalConversation();
    if (!globalConversation) {
      const createdConversation = await this.conversationService.createGlobalConversation();
      client.join(createdConversation.id);
    }

    const userId = client.data.userId;

    if (!userId) {
      client.emit('error', { message: 'Not authenticated' });

      return;
    }

    try {
      await this.conversationService.createMessage({
        userId: userId,
        conversationId: data.conversationId,
        content: data.message,
      });
    } catch (error) {
      client.emit('error', { message: (error as Error).message });
    }

    // this.server.emit('message', data);
  }
}
