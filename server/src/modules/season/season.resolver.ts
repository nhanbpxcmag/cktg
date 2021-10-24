import { Resolver } from '@nestjs/graphql';
import { SeasonService } from './season.service';

@Resolver('Season')
export class SeasonResolver {
  constructor(private readonly seasonService: SeasonService) {}
}
