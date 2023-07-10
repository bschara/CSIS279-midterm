import { Injectable, UnauthorizedException, NotFoundException  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Customer } from './customer.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateCustomerDto } from './dto/update-customer.dto';


@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer) 
    private userRepository: Repository<Customer>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Customer> {
    const { email, password, username, first_name, last_name, wallet_address, secret_key} = createUserDto;
    const customer = this.userRepository.create({
      email: email,
      password: password,
      username: username,
      first_name: first_name,
      last_name: last_name,
      wallet_address: wallet_address,
      secret_key: secret_key
    });
    return this.userRepository.save(customer);
  }

  async login(loginUserDto: LoginUserDto): Promise<{ token: string }> {
    const { email, password } = loginUserDto;
    const customer = await this.userRepository.findOne({ where: {email} });
    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (customer.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwtService.sign({ email: customer.email });
    return { token };
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async updateCustomer(email: string, updateCustomer: UpdateCustomerDto): Promise<Customer> {
    const organizer = await this.getCustomerByEmail(email);
    organizer.first_name = updateCustomer.firstName ?? organizer.first_name;
    organizer.last_name = updateCustomer.lastName ?? organizer.last_name;
    organizer.wallet_address = updateCustomer.walletAddress ?? organizer.wallet_address;
    organizer.secret_key = updateCustomer.privateKey?? organizer.secret_key;
    // update other organizer properties as needed
    return this.userRepository.save(organizer);
  }

  async getWalletAndSecretKeyByEmail(email: string): Promise<{ walletAddress: string, secretKey: string }> {
    const customer = await this.userRepository.findOne({ where: { email } });
    if (!customer) {
      // handle case where customer with given email is not found
      throw new NotFoundException('Customer not found');
    }
    return {
      walletAddress: customer.wallet_address,
      secretKey: customer.secret_key,
    };
  }
}
