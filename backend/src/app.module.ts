import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customer.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './database/database.connection'; 
import { OrganizerModule } from './organizers/organizer.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    CustomersModule, OrganizerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
