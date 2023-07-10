import { Controller, Post, Body, Put, Param, Get } from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { LoginOrganizerDto } from './dto/login-organizer.dto';
import { UpdateOrganizerDto } from './dto/update-organizer.dto';
import { Organizer } from './organizer.entity';

@Controller('organizers')
export class OrganizerController {
  constructor(private organizerService: OrganizerService) {}

  @Post('register')
  async register(@Body() createOrganizerDto: CreateOrganizerDto) {
    return await this.organizerService.create(createOrganizerDto);
  }

  @Post('login')
  async login(@Body() loginOrganizerDto: LoginOrganizerDto) {
    return await this.organizerService.login(loginOrganizerDto);
  } 

  @Put('/update/:email')
  async updateUser(@Param('email') email: string, @Body() updateUserDto: UpdateOrganizerDto): Promise<Organizer> {
    return this.organizerService.updateOrganizer(email, updateUserDto);
  }

  @Get('/user-data/:email')
  async getWalletAndSecretKey(@Param('email') email: string) {
    return await this.organizerService.getWalletAndSecretKeyByEmail(email);
  }

}
