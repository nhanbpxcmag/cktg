import { RegionModule } from './../region/region.module';
import { TournamentSchema } from './schemas/tournament.schema';
import { Tournament } from './schemas/tournament.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentResolver } from './tournament.resolver';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Tournament.name,
        useFactory: () => {
          const schema = TournamentSchema;
          schema.index({ code: 1, region: 1 }, { unique: true });
          return schema;
        },
      },
    ]),
    RegionModule,
  ],
  providers: [TournamentResolver, TournamentService],
  exports: [TournamentService],
})
export class TournamentModule {}
