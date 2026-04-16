import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://week5day2-frontend.vercel.app',
    process.env.FRONTEND_URL || 'http://localhost:3001',
  ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  const PORT = parseInt(process.env.PORT || '3000', 10);
  await app.listen(PORT, '0.0.0.0');
  console.log(`Server running on port ${PORT}`);
}
bootstrap();
