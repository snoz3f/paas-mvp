import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import type { Request } from 'express';
import { AppModule } from './app.module';
import { requireEnv } from './common/require-env';
import { TrpcService } from './trpc/trpc.service';

async function bootstrap() {
  requireEnv('JWT_SECRET');
  requireEnv('WORKER_SECRET');

  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const trpc = app.get(TrpcService);
  app.use('/trpc', createExpressMiddleware({
    router: trpc.router,
    createContext: ({ req }) => trpc.createContext({ req: req as Request }),
  }));

  const config = new DocumentBuilder()
    .setTitle('PaaS MVP API')
    .setDescription('API для деплоя приложений')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .addSecurityRequirements('access-token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(process.env.PORT ?? 5001);
}

void bootstrap();
