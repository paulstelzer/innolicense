import { Controller, Post, HttpStatus, HttpCode, Get, Response, Body, Req, Param } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { Users } from '../interfaces/users.entity';
import { ResponseError, ResponseSuccess } from '../../common/interfaces/response.interface';
import { AuthErrorCode } from '../../common/interfaces/auth.error.code';
import { UserRegisterBody, UserLoginBody } from '../interfaces/users.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }

    /**
     * Login User with Email and Password
     * @param res Response
     * @param body Post Body
     */
    @Post('login')
    async loginUser(@Response() res: any, @Body() body: UserLoginBody) {
        try {
            if (!(body && body.email && body.password)) {
                return res.status(HttpStatus.FORBIDDEN).json(new ResponseError(AuthErrorCode.DATA_PARAMS_MISSING));
            }

            const user = await this.usersService.getUserByEmail(body.email);

            if (user && user.password) {
                if (await this.usersService.compareHash(body.password, user.password)) {
                    const token = await this.authService.createToken(user.id, user.email);
                    return res.status(HttpStatus.OK).json(new ResponseSuccess({
                        token: token,
                        user: user
                    }));
                }
            }
            return res.status(HttpStatus.FORBIDDEN).json(new ResponseError(AuthErrorCode.AUTH_FAILED));
        } catch (error) {
            return res.status(HttpStatus.FORBIDDEN).json(new ResponseError(AuthErrorCode.FAILED, null, error));
        }
    }

    /**
     * Register a new User
     * @param res Response
     * @param body Post Body
     */
    @Post('register')
    async registerUser(@Response() res: any, @Body() body: UserRegisterBody) {
        try {
            if (!(body && body.email && body.password)) {
                return res.status(HttpStatus.FORBIDDEN).json(new ResponseError(AuthErrorCode.DATA_PARAMS_MISSING));
            }

            let user = await this.usersService.getUserByEmail(body.email);

            if (user) {
                return res.status(HttpStatus.FORBIDDEN).json(new ResponseError(AuthErrorCode.USER_MAIL_EXIST));
            } else {
                let vendor = false;
                if (body.vendor) {
                    vendor = true;
                }
                user = await this.usersService.createUser(body.email, body.password, 'de', vendor);
                if (user) {
                    user.password = undefined;
                }
            }

            return res.status(HttpStatus.OK).json(new ResponseSuccess(user));
        } catch (error) {
            return res.status(HttpStatus.FORBIDDEN).json(new ResponseError(AuthErrorCode.FAILED, null, error));
        }
    }

    /**
     * Verify the Email of a user
     * @param params 
     */
    @Get('verify/:token')
    public async verifyEmail(@Param() params: { token: string }): Promise<ResponseSuccess | ResponseError> {
        try {
            const isEmailVerified = await this.authService.verifyEmail(params.token);
            return new ResponseSuccess({ verified: isEmailVerified });
        } catch (error) {
            return new ResponseError(AuthErrorCode.FAILED, null, error);
        }
    }
}