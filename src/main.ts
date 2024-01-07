import { NestFactory } from '@nestjs/core';
// import { ValidationPipe, HttpException, BadRequestException } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // main startup globalPipes
  // dipindah di app.module
  // app.useGlobalPipes(
    // new ValidationPipe({
      // exceptionFactory: (validationErrors: any[] = []) => {
      //   const err = {}
      //   validationErrors.forEach(error => {
      //     err[error.property] = Object.values(error.constraints)
      //   })
      //   return new HttpException({
      //     statusCode: 400,
      //     error: 'This is a custom message',
      //     messages: err
      //   }, 400);
      // },
      // whitelist: true
    // })
  // );

  await app.listen(3000);
}
bootstrap();
