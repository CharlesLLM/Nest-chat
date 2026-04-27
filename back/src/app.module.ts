import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
// import { ConversationModule } from './conversation/conversation.module';
import { MessagesGateway } from './messages/messages.gateway';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    MessagesModule,
  ],
  providers: [JwtService, MessagesGateway],
})
export class AppModule {}
