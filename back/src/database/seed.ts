import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);

  const user1 = {
    email: 'test@test.com',
    password: 'Test123',
    username: 'testuser',
    displayColor: '#ff0000',
  };

  await userService.create(user1);

  const user2 = {
    email: 'test2@test.com',
    password: 'Test123',
    username: 'testuser2',
    displayColor: '#00ff00',
  };

  await userService.create(user2);

  await app.close();
}

bootstrap();
