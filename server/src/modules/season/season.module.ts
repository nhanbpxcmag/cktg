import { TournamentModule } from './../tournament/tournament.module';
import { TournamentSchema } from './../tournament/schemas/tournament.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { SeasonService } from './season.service';
import { SeasonResolver } from './season.resolver';
import { Tournament } from '../tournament/schemas/tournament.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Tournament.name,
        useFactory: () => {
          const schema = TournamentSchema;
          schema.index({ code: 1, year: 1, tournament: 1 }, { unique: true });
          return schema;
        },
      },
    ]),
    TournamentModule,
  ],
  providers: [SeasonResolver, SeasonService],
  exports: [SeasonService],
})
export class SeasonModule {}
