import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { GoogleAuthenticationController } from './google-auth.controller';
import { GoogleAuthenticationService } from './google-auth.service';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [GoogleAuthenticationController],
  providers: [GoogleAuthenticationService],
})
export class GoogleAuthModule {}
