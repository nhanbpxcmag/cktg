import { RegionModule } from './../region/region.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from './schemas/team.schema';
import { TeamResolver } from './team.resolver';
import { TeamService } from './team.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Team.name,
        useFactory: () => {
          const schema = TeamSchema;
          schema.index({ code: 1, region: 1 }, { unique: true });
          return schema;
        },
      },
    ]),
    RegionModule,
  ],
  providers: [TeamResolver, TeamService],
  exports: [TeamService],
})
export class TeamModule {}
