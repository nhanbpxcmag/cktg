import { ERROR_CONSTANT } from './../../constants';
import { HttpStatus, BadRequestException } from '@nestjs/common';
import { IError } from './../../common/interfaces/error.interface';
import { Region } from './schemas/region.schema';
import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { CreateRegionInput, UpdateRegionInput } from './dto/region.input';
import { RegionService } from './region.service';
import { Public } from 'src/shared/decorators/isPublic.decorator';

@Resolver('Region')
export class RegionResolver {
  constructor(private readonly regionService: RegionService) {}

  @Query((returns) => [Region])
  @Public()
  async regions(): Promise<Region[]> {
    const regions = await this.regionService.regions();
    return regions;
  }

  @Query((returns) => Region)
  @Public()
  async region(@Args('_id') _id: string): Promise<Region> {
    const region = await this.regionService.findById(_id);
    return region;
  }

  @Mutation((returns) => Region)
  // @Permissions(IPermission.Admin)
  async createRegion(
    @Args('createRegionInput') createRegionInput: CreateRegionInput,
  ): Promise<Region> {
    const newRegion = await this.regionService.create(createRegionInput);
    return newRegion;
  }

  @Mutation((returns) => Region)
  async updateRegion(
    @Args('updateRegionInput') updateRegionInput: UpdateRegionInput,
  ): Promise<Region> {
    return this.regionService.update(updateRegionInput);
  }

  @Mutation((returns) => Boolean)
  async deleteRegion(@Args('_id') _id: string): Promise<boolean> {
    const deleteRegion = await this.regionService.delete(_id);
    if (!deleteRegion) {
      const message: IError = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: [
          {
            value: _id,
            property: '_id',
            constraints: {
              usernameOrEmail: `Khu vực đã được xóa hoặc không tồn tại`,
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
