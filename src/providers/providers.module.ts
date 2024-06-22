import { Module } from '@nestjs/common';
import { BrevoService } from './services/transactional-emails/brevo/brevo.service';

@Module({
  providers: [BrevoService]
})
export class ProvidersModule {}
