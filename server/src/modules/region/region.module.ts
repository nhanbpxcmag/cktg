import { RegionController } from './region.controller';
import { Region, RegionSchema } from './schemas/region.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { RegionResolver } from './region.resolver';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Region.name,
        useFactory: () => {
          const schema = RegionSchema;
          schema.index({ code: 1 }, { unique: true });
          return schema;
        },
      },
    ]),
  ],
  controllers: [RegionController],
  providers: [RegionResolver, RegionService],
  exports: [RegionService],
})
export class RegionModule {}
