import { ERROR_CONSTANT } from './../../constants';
import { HttpStatus, BadRequestException } from '@nestjs/common';
import { IError } from './../../common/interfaces/error.interface';
import { Season } from './schemas/season.schema';
import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { CreateSeasonInput, UpdateSeasonInput } from './dto/season.input';
import { SeasonService } from './season.service';
import { Public } from 'src/shared/decorators/isPublic.decorator';

@Resolver('season')
export class SeasonResolver {
  constructor(private readonly seasonService: SeasonService) {}

  @Query((returns) => [Season], { nullable: true })
  @Public()
  async seasons(): Promise<Season[]> {
    const Seasons = await this.seasonService.seasons();
    return Seasons;
  }

  @Query((returns) => Season)
  @Public()
  async season(@Args('_id') _id: string): Promise<Season> {
    const Season = await this.seasonService.findById(_id);
    return Season;
  }

  @Mutation((returns) => Season)
  // @Permissions(IPermission.Admin)
  async createSeason(
    @Args('createSeasonInput') createSeasonInput: CreateSeasonInput,
  ): Promise<Season> {
    const newSeason = await this.seasonService.create(createSeasonInput);
    return newSeason;
  }

  @Mutation((returns) => Season)
  async updateSeason(
    @Args('updateSeasonInput') updateSeasonInput: UpdateSeasonInput,
  ): Promise<Season> {
    return this.seasonService.update(updateSeasonInput);
  }

  @Mutation((returns) => Boolean)
  async deleteSeason(@Args('_id') _id: string): Promise<boolean> {
    const deleteSeason = await this.seasonService.delete(_id);
    if (!deleteSeason) {
      const message: IError = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: [
          {
            value: _id,
            property: '_id',
            constraints: {
              usernameOrEmail: `Mùa giải đã được xóa hoặc không tồn tại`,
            },
          },
        ],
        error: ERROR_CONSTANT.VALIDATION_INPUT,
      };
      throw new BadRequestException(message, ERROR_CONSTANT.VALIDATION_INPUT);
    }
    return true;
  }
}
