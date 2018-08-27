import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from "class-validator";
import { Users } from './users.entity';

@Entity()
export class UsersVerify extends BaseEntity {
    
    @ManyToOne(type => Users)
    @JoinColumn({ name: 'userId' })
    user: Users;
  
    @PrimaryColumn()
    userId: number;
    
    @Column()
    token: string;

    constructor(user, token) {
        super();
        this.user = user;
        this.token = token;
    }
}