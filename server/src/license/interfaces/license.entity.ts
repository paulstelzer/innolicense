import { EnvatoItem } from './envato-item.entity';
import { WpPlugin } from './wp-plugin.entity';
import { Licensenumber } from './licensenumber.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable, BaseEntity, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class License extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Name of License
  @Column()
  name: string;

  @ManyToOne(type => Product, product => product.licenses)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: number;

  @OneToMany(type => Licensenumber, licensenumber => licensenumber.license, { onDelete: 'CASCADE' })
  licenseNumbers: License[];

  @OneToMany(type => EnvatoItem, envato => envato.license, { onDelete: 'CASCADE' })
  envato: EnvatoItem[];

  // How many URLs
  @Column()
  volume: number;

  // In days
  @Column()
  validTime: number;

  // In days
  @Column()
  supportTime: number;

/*   @ManyToMany(type => Files)
  @JoinTable()
  files: Files[]; */

  @ManyToMany(type => WpPlugin, wp => wp.licenses, { cascade: true })
  plugins: WpPlugin[];

  @Column("simple-array")
  features: string[];

  /**
   * Create a new license
   * @param product Which Product
   * @param volume How many URLs are allowed (0 for unlimited)
   * @param validTime In days, how long valid (0 for unlimited)
   */
  constructor(product: Product, name: string, volume: number, validTime: number, supportTime: number, features: string[]) {
    super();
    this.product = product;
    this.name = name;
    this.volume = volume;
    this.supportTime = supportTime;
    this.validTime = validTime;
    this.features = features;
  }
}