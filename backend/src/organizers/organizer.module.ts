
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { OrganizerController } from './organizer.controller';
import { OrganizerService } from './organizer.service';
import { Organizer } from './organizer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organizer]),
    JwtModule.register({
      secret: 'BxVBA2SbBFUQsi4AmO2wg', // Replace with your own secret key
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [OrganizerController],
  providers: [OrganizerService],
  exports: [JwtModule], // Export the JwtModule so that JwtService can be used in other modules
})
export class OrganizerModule {}
