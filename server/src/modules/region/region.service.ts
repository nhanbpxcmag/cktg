import { ERROR_CONSTANT } from './../../constants';
import { IError } from './../../common/interfaces/error.interface';
import { plainToClass } from 'class-transformer';
import { CreateRegionInput, UpdateRegionInput } from './dto/region.input';
import { Region, RegionDocument } from './schemas/region.schema';
import { Injectable, HttpStatus, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateResult } from 'mongodb';

@Injectable()
export class RegionService {
  constructor(
    @InjectModel(Region.name)
    private readonly regionModel: Model<RegionDocument>,
  ) {}

  async regions(): Promise<Region[]> {
    const regions = await this.regionModel.find().lean().exec();
    return plainToClass(Region, regions);
  }

  async create(region: CreateRegionInput): Promise<Region> {
    const newRegion = await new this.regionModel(region).save();
    return newRegion;
  }

  async update(updateRegionInput: UpdateRegionInput): Promise<Region> {
    const { _id, code, name } = updateRegionInput;
    const existingPost = await this.regionModel.findById(_id);
    if (!existingPost) {
      const message: IError = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: [
          {
            value: _id,
            property: '_id',
            constraints: {
              usernameOrEmail: `Id không tồn tại`,
            },
          },
        ],
        error: ERROR_CONSTANT.VALIDATION_INPUT,
      };
      throw new BadRequestException(message, ERROR_CONSTANT.VALIDATION_INPUT);
    }
    if (await this.checkCodeId(_id, code)) {
      const message: IError = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: [
          {
            value: _id,
            property: '_id',
            constraints: {
              usernameOrEmail: `Mã đã tồn tại`,
            },
          },
        ],
        error: ERROR_CONSTANT.VALIDATION_INPUT,
      };
      throw new BadRequestException(message, ERROR_CONSTANT.VALIDATION_INPUT);
    }
    existingPost.code = code;
    existingPost.name = name;
    existingPost.save();
    return existingPost;
  }

  async delete(_id: string): Promise<boolean> {
    const deleteRegion = await this.regionModel
      .deleteOne({ _id })
      .lean()
      .exec();
    return deleteRegion.deletedCount ? true : false;
  }

  async updateById(
    updateRegionInput: UpdateRegionInput,
  ): Promise<UpdateResult> {
    const { _id, code, name } = updateRegionInput;
    const newRegion = await this.regionModel
      .updateOne({ _id }, { code, name })
      .lean()
      .exec();

    return newRegion;
  }

  async findById(id: string): Promise<Region> {
    const region = await this.regionModel.findById(id).lean().exec();
    return plainToClass(Region, region);
  }

  async checkCodeId(id: string, code: string): Promise<boolean> {
    const region = await this.regionModel
      .find({
        code,
        _id: { $ne: id },
      })
      .lean()
      .exec();
    return region.length ? true : false;
  }
}
