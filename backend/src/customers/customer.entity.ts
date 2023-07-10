import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({unique: true})
  username: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  wallet_address: string;

  @Column()
  secret_key: string;
}