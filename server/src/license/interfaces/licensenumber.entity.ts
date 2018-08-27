import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity, JoinColumn } from 'typeorm';
import { Users } from '../../users/interfaces/users.entity';
import { License } from './license.entity';

@Entity()
export class Licensenumber extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, default: null })
  envatoId: string;

  @Column()
  status: string;

  @Column({default: null})
  activatedOn: Date;

  @Column()
  createdAt: Date;

  @Column({default: null})
  validUntil: Date;

  @Column({default: null})
  supportUntil: Date;

  @ManyToOne(type => Users)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column({default: null})
  userId: number;

  @ManyToOne(type => License, license => license.licenseNumbers)
  @JoinColumn({ name: 'licenseId' })
  license: License;

  @Column({default: null})
  licenseId: number;

  @Column()
  notify: boolean;

  @Column("simple-array")
  url: string[];

  constructor(user: Users, license: License, notify: boolean = false, status: string = 'available') {
    super();
    this.user = user;
    this.license = license;
    this.status = status;
    this.notify = notify;
    this.url = [];
    this.createdAt = new Date();
  }
}