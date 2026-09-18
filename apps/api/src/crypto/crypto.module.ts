import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { CryptoService } from './crypto.service';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}
