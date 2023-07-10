import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity('organizer')
export class Organizer{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
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