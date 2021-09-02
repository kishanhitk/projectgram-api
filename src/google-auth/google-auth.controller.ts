import {
  Controller,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import TokenVerificationDto from './tokenVerification.dto';
import { GoogleAuthenticationService } from './google-auth.service';

@Controller('google-authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}

  @Post()
  async authenticate(@Body() tokenData: TokenVerificationDto) {
    return await this.googleAuthenticationService.authenticate(tokenData.token);
  }
}
