import { forwardRef, Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [forwardRef(() => MessagesModule)],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
