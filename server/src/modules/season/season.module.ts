import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TournamentModule } from './../tournament/tournament.module';
import { Season, SeasonSchema } from './schemas/season.schema';
import { SeasonResolver } from './season.resolver';
import { SeasonService } from './season.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Season.name,
        useFactory: () => {
          const schema = SeasonSchema;
          schema.index({ code: 1 }, { unique: true });
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
