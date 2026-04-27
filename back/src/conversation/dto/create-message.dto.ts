import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    description: 'Message content',
    example: 'Hello, how are you?',
  })
  @IsString({ message: 'Message content should be a string' })
  @IsNotEmpty({ message: 'Message content should not be empty' })
  content: string;

  @ApiProperty({
    description: 'User ID of the message sender',
    example: 'user-123',
  })
  @IsString({ message: 'User ID should be a string' })
  @IsNotEmpty({ message: 'User ID should not be empty' })
  userId: string;

  @ApiProperty({
    description: 'Conversation ID of the message',
    example: 'conversation-123',
  })
  @IsString({ message: 'Conversation ID should be a string' })
  @IsNotEmpty({ message: 'Conversation ID should not be empty' })
  conversationId: string;
}
