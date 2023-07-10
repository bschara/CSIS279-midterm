import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Customer } from './customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    JwtModule.register({
      secret: 'BxVBA2SbBFUQsi4AmO2wg', // Replace with your own secret key
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [JwtModule], // Export the JwtModule so that JwtService can be used in other modules
})
export class CustomersModule {}
