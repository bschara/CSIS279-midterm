import { Controller, Post, Body, Put, Param, Get } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import {Customer} from "../customers/customer.entity";

@Controller('customers')
export class CustomerController {
  constructor(private userService: CustomerService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.userService.login(loginUserDto);
  } 


  @Put('/update/:email')
  async updateUser(@Param('email') email: string, @Body() updateUserDto: UpdateCustomerDto): Promise<Customer> {
    return this.userService.updateCustomer(email, updateUserDto);
  }

  @Get('/user-data/:email')
  async getWalletAndSecretKey(@Param('email') email: string) {
    return await this.userService.getWalletAndSecretKeyByEmail(email);
  }
}
