import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';

export class UserCreateRequestBody {
  @ApiProperty() username: string;
  @ApiProperty() password: string;
  @ApiProperty() email: string;
  @ApiProperty() firstName: string;
  @ApiPropertyOptional() lastName?: string;
  @ApiPropertyOptional() bio?: string;
}
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get()
  async getAllUser() {
    return await this.userService.getAllUser();
  }

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    return this.userService.addAvatar(
      req.user.username,
      file.buffer,
      file.originalname,
    );
  }

  @Post()
  async createNewUser(@Body() CreateUserRequestBody: UserCreateRequestBody) {
    return await this.userService.createUser(CreateUserRequestBody);
  }

  @Get('/:username/projects')
  async getAllProjectsByUsername(@Param('username') username: string) {
    return await this.userService.getAllProjectsByUsername(username);
  }

  @Get('/:username')
  async getUser(@Param('username') username: string) {
    return await this.userService.getUserByUsername(username);
  }
}
