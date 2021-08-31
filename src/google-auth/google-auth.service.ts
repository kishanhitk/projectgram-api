import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { google, Auth } from 'googleapis';
import { User } from 'src/users/entities/users.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class GoogleAuthenticationService {
  oauthClient: Auth.OAuth2Client;
  constructor(
    private readonly usersService: UsersService,
    private readonly authenticationService: AuthService,
  ) {
    const clientID = process.env.GOOGLE_AUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_AUTH_CLIENT_SECRET;

    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async authenticate(token: string) {
    const tokenInfo = await this.oauthClient.getTokenInfo(token);

    const email = tokenInfo.email;

    try {
      const user = await this.usersService.getUserByEmail(email);
      console.log(user);
      return this.handleRegisteredUser(user);
    } catch (error) {
      if (error.status !== 404) {
        throw error;
        throw new InternalServerErrorException(error);
      }
      return this.registerUser(token, email);
    }
  }

  async registerUser(token: string, email: string) {
    const userData = await this.getUserData(token);
    const firstName = userData.given_name;
    const lastName = userData.family_name;
    const picture = userData.picture;
    const userName = userData.id;
    console.log(userData);
    const user = await this.usersService.createWithGoogle(
      email,
      firstName,
      lastName,
      picture,
      userName,
    );

    return this.handleRegisteredUser(user);
  }
  async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oauthClient.setCredentials({
      access_token: token,
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    });

    return userInfoResponse.data;
  }

  async handleRegisteredUser(user: User) {
    if (!user.isRegisteredWithGoogle) {
      throw new UnauthorizedException();
    }
    return await this.authenticationService.login(user);
  }
}
