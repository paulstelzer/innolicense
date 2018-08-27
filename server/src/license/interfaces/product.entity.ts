import { License } from './license.entity';
import { Users } from './../../users/interfaces/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';

import * as uuidV4 from 'uuid/v4';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  secretKey: string;

  @ManyToOne(type => Users)
  user: Users;

  @Column()
  userId: number;

  @Column({ length: 100, nullable: true })
  name: string | undefined;

/*   @ManyToMany(type => Files, { onDelete: 'CASCADE' })
  @JoinTable()
  files: Files[]; */

  @OneToMany(type => License, license => license.product, { onDelete: 'CASCADE' })
  licenses: License[];

  constructor(name, user) {
    super();
    this.name = name;
    this.user = user;
    this.secretKey = uuidV4();
  }

}