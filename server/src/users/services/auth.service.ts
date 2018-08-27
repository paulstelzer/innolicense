import { JwtPayload } from './../interfaces/jwt-payload.interface';
import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from '../interfaces/users.entity';
import { AuthErrorCode } from '../../common/interfaces/auth.error.code';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
    ) { }

    /**
     * Create access token for user
     * @param id User ID
     * @param email User Email
     */
    async createToken(id: number, email: string) {
        const expiresIn = 60 * 60 * 24 * 14;
        const secretOrKey = process.env.secretkey;

        // To create the JwtPayload
        const user = { id, email };
        const token = jwt.sign(user, secretOrKey, { expiresIn });

        return { expires_in: expiresIn, token };
    }

    /**
     * Validate if user exists
     * @param signedUser 
     */
    async validateUser(signedUser: JwtPayload): Promise<Users> {
        if (signedUser && signedUser.id) {
            const user = await this.usersService.getUserById(signedUser.id);
            return user;
        }

        return null;
    }

    /**
     * Verify Email
     * @param token 
     */
    async verifyEmail(token) {
        const verify = await this.usersService.findToken(token);
        if (verify && verify.userId) {
            return true;
        }

        return false;

    }
}
