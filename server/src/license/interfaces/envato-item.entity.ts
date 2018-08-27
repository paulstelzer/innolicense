import { Entity, Column, PrimaryColumn, BaseEntity, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { License } from './license.entity';

@Entity()
export class EnvatoItem extends BaseEntity {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @PrimaryColumn()
    licenseType: string;

    @ManyToOne(type => License, license => license.envato)
    license: License;

    @Column({default: null})
    licenseId: number;

    constructor(id: number, name: string, type: string, license: License) {
        super();
        this.id = id;
        this.name = name;
        this.licenseType = type;
        this.license = license;
    }

}