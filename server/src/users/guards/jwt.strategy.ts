import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * Uses the Passport Strategy to validate a user
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'mip') {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.secretkey
        });
    }

    /**
     * Function from PassportStrategy to validate the user 
     * and return if it success or fails
     * @param payload 
     * @param done 
     */
    async validate(payload: JwtPayload, done: Function) {
        const user = await this.authService.validateUser(payload);
        if (!user) {
            return done(new UnauthorizedException(), false);
        }
        done(null, user);
    }
}