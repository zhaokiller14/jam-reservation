import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const parsedPort = Number.parseInt(process.env.PORT ?? '3000', 10);
  const port = Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 3000;
  const frontendUrlRaw = process.env.FRONTEND_URL?.trim();
  const frontendUrl = frontendUrlRaw
    ? (/^https?:\/\//i.test(frontendUrlRaw)
        ? frontendUrlRaw
        : `https://${frontendUrlRaw}`)
    : undefined;

  app.enableCors({
    origin: frontendUrl || '*',
    methods: ['GET', 'POST'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(port, '0.0.0.0');
  console.log(`Backend running on port ${port}`);
}
bootstrap();