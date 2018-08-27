import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../interfaces/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Entropy, charset32 } from 'entropy-string'
import { UsersVerify } from '../interfaces/users-verify.entity';
import { UserMailService } from './user-mail.service';

@Injectable()
export class UsersService {
    private saltRounds = 10;

    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
        @InjectRepository(UsersVerify)
        private readonly usersVerifyRepository: Repository<UsersVerify>,
        private userMailService: UserMailService,
    ) { }


    async getUsers(): Promise<Users[]> {
        return await this.usersRepository.find();
    }

    async getUserById(id: number): Promise<Users> {
        return (await this.usersRepository.findOne({ id }));
    }

    async getUserByEmail(email: string): Promise<Users> {
        return (await this.usersRepository.findOne({ email }));
    }

    async createUser(email: string, pw: string = null, language: string = 'de', vendor: boolean = false): Promise<Users> {
        let plainPw = null;
        if (!pw) {
            plainPw = this.randomPassword();
        } else {
            plainPw = pw;
        }
        const pwHash = await this.getHash(plainPw);

        const user: Users = new Users(email, pwHash, language);
        user.roles = ['user'];
        if (vendor) {
            user.roles.push('vendor');
        }
        const u = await user.save();

        const verify = new UsersVerify(u, this.randomToken());
        const verified = await verify.save();

        if (verified && verified.token) {
            this.userMailService.sendVerifyEmail(verified);
        }

        return u;
    }

    async findToken(token): Promise<UsersVerify> {
        return (await this.usersVerifyRepository.findOne({ token: token }));
    }

    randomPassword() {
        const entropy = new Entropy();
        return entropy.mediumID();
    }

    randomToken() {
        const entropy = new Entropy()
        return entropy.sessionID();
    }

    async getHash(password: string | undefined): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    async compareHash(password: string | undefined, hash: string | undefined): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}