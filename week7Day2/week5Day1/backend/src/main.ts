import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for Socket.IO and HTTP requests
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log('Server running on port', process.env.PORT ?? 3000);
}
bootstrap();
