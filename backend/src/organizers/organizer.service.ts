
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Organizer } from "./organizer.entity"
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { LoginOrganizerDto } from './dto/login-organizer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateOrganizerDto } from '../organizers/dto/update-organizer.dto';

@Injectable()
export class OrganizerService {
  constructor(
    @InjectRepository(Organizer) 
    private organizerRepository: Repository<Organizer>,
    private jwtService: JwtService,
  ) {}

  async create(createOrganizerDto: CreateOrganizerDto): Promise<Organizer> {
    const { email, password, username, first_name, last_name, wallet_address, secret_key } = createOrganizerDto;
    const organizer = this.organizerRepository.create({
      email: email,
      password: password,
      username: username,
      first_name: first_name,
      last_name: last_name,
      wallet_address: wallet_address,
      secret_key: secret_key
    });
    return this.organizerRepository.save(organizer);
  }
  
  async login(loginOrganizerDto: LoginOrganizerDto): Promise<{ token: string }> {
    const { email, password } = loginOrganizerDto;
    const organizer = await this.organizerRepository.findOne({ where: {email} });
    if (!organizer) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (organizer.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwtService.sign({ email: organizer.email });
    return { token };
  }

  
  async getOrganizerByEmail(email: string): Promise<Organizer | undefined> {
    return this.organizerRepository.findOne({ where: { email } });
  }

  async updateOrganizer(email: string, updateOrganizerDto: UpdateOrganizerDto): Promise<Organizer> {
    const organizer = await this.getOrganizerByEmail(email);
    organizer.first_name = updateOrganizerDto.firstName ?? organizer.first_name;
    organizer.last_name = updateOrganizerDto.lastName ?? organizer.last_name;
    organizer.wallet_address = updateOrganizerDto.walletAddress ?? organizer.wallet_address;
    organizer.secret_key = updateOrganizerDto.privateKey?? organizer.secret_key;
    // update other organizer properties as needed
    return this.organizerRepository.save(organizer);
  }

  async getWalletAndSecretKeyByEmail(email: string): Promise<{ walletAddress: string, secretKey: string }> {
    const organizer = await this.organizerRepository.findOne({ where: { email } });
    if (!organizer) {
      // handle case where customer with given email is not found
      throw new NotFoundException('Customer not found');
    }
    return {
      walletAddress: organizer.wallet_address,
      secretKey: organizer.secret_key,
    };
  }
  
}
