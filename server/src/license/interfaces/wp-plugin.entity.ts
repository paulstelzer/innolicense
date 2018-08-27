import { License } from './license.entity';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { Users } from '../../users/interfaces/users.entity';

@Entity()
export class WpPlugin extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    slug: string;

    @Column()
    version: string;

    @Column()
    downloadUrl: string;

    @Column()
    description: string;

    @Column({default: null})
    changelog: string;

    @Column({default: null})
    homepage: string;

    @Column({default: null})
    requires: string;

    @Column({default: null})
    tested: string;

    @Column()
    lastUpdated: Date;

    @Column({default: null})
    author: string;

    @Column({default: null})
    authorHomepage: string;

    @ManyToMany(type => License, license => license.plugins, { onDelete: 'CASCADE' })
    @JoinTable()
    licenses: License[];

    @ManyToOne(type => Users)
    user: Users;
  
    @Column()
    userId: number;

    constructor(name: string, slug: string, version: string, downloadUrl: string, description: string, user: Users) {
        super();
        this.name = name;
        this.slug = slug;
        this.version = version;
        this.downloadUrl = downloadUrl;
        this.description = description;
        this.user = user;
        this.lastUpdated = new Date();
    }

}