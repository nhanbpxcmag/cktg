import { Region } from './../region/schemas/region.schema';
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { Model } from 'mongoose';
import {
  IError,
  IErrorMessage,
} from './../../common/interfaces/error.interface';
import { ERROR_CONSTANT } from './../../constants';
import { RegionService } from './../region/region.service';
import { CreateTeamInput, UpdateTeamInput } from './dto/team.input';
import { Team, TeamDocument } from './schemas/team.schema';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name)
    private readonly TeamModel: Model<TeamDocument>,
    private readonly regionService: RegionService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  async teams(): Promise<Team[]> {
    const Teams = await this.TeamModel.find()
      .populate({
        path: 'region',
        model: Region.name,
        populate: {
          path: 'region',
          model: Region.name,
        },
      })
      .lean()
      .exec();
    return plainToClass(Team, Teams);
  }

  async validateCreate(Team: CreateTeamInput) {
    const { code, name, number, regionId } = Team;
    const errorMessage: IErrorMessage[] = [];
    const cRegion = await this.regionService.findById(regionId);
    const team = await this.TeamModel.findOne({ code, region: cRegion })
      .lean()
      .exec();

    if (team) {
      errorMessage.push({
        value: code,
        property: 'code',
        constraints: {
          usernameOrEmail: `Mã đội tồn tại`,
        },
      });
    }

    if (!cRegion) {
      errorMessage.push({
        value: regionId,
        property: 'regionId',
        constraints: {
          usernameOrEmail: `Khu vực không tồn tại`,
        },
      });
    }

    if (errorMessage.length) {
      const message: IError = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: errorMessage,
        error: ERROR_CONSTANT.VALIDATION_INPUT,
      };
      throw new BadRequestException(message, ERROR_CONSTANT.VALIDATION_INPUT);
    }
    return true;
  }

  async create(Team: CreateTeamInput): Promise<Team> {
    const { code, name, description, number, regionId } = Team;

    await this.validateCreate(Team);
    const session = await this.TeamModel.db.startSession();
    session.startTransaction();
    try {
      const newTeam = await new this.TeamModel({
        code,
        name,
        description,
        number,
        region: regionId,
      }).save();

      await newTeam.populate({
        path: 'region',
        model: Region.name,
      });
      await session.commitTransaction();
      session.endSession();
      return newTeam;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      this.logger.error(error, { ...Team, actionService: 'create' });
    }
  }

  async validateUpdate(updateTeamInput: UpdateTeamInput) {
    const { _id, code, name, number, regionId } = updateTeamInput;
    const errorMessage: IErrorMessage[] = [];

    const existingTeam = await this.TeamModel.findById(_id).populate({
      path: 'region',
      model: Region.name,
    });
    const cRegion = await this.regionService.findById(regionId);

    if (!existingTeam) {
      errorMessage.push({
        value: _id,
        property: '_id',
        constraints: {
          usernameOrEmail: `_id đội đã bị xóa hoặc không tồn tại`,
        },
      });
    }
    if (await this.checkCodeId(_id, code, cRegion)) {
      errorMessage.push({
        value: code,
        property: 'code',
        constraints: {
          usernameOrEmail: `Mã đội đã tồn tại`,
        },
      });
    }
    if (!cRegion) {
      errorMessage.push({
        value: regionId,
        property: 'regionId',
        constraints: {
          usernameOrEmail: `Khu vực không tồn tại`,
        },
      });
    }

    if (errorMessage.length) {
      const message: IError = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: errorMessage,
        error: ERROR_CONSTANT.VALIDATION_INPUT,
      };
      throw new BadRequestException(message, ERROR_CONSTANT.VALIDATION_INPUT);
    }

    return { existingTeam, cRegion };
  }

  async update(updateTeamInput: UpdateTeamInput): Promise<Team> {
    const { _id, code, name, description, number, regionId } = updateTeamInput;

    const { existingTeam, cRegion } = await this.validateUpdate(
      updateTeamInput,
    );
    const session = await this.TeamModel.db.startSession();
    session.startTransaction();
    try {
      existingTeam.code = code;
      existingTeam.name = name;
      existingTeam.description = description;
      existingTeam.number = number;
      existingTeam.region = cRegion;
      existingTeam.save();
      await session.commitTransaction();
      session.endSession();
      return existingTeam;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      this.logger.error(error, { ...Team, actionService: 'update' });
    }
  }

  async delete(_id: string): Promise<boolean> {
    const deleteTeam = await this.TeamModel.deleteOne({ _id }).lean().exec();
    return deleteTeam.deletedCount ? true : false;
  }

  async findById(id: string): Promise<Team> {
    const team = this.TeamModel.findById(id)
      .populate({
        path: 'region',
        model: Region.name,
      })
      .lean()
      .exec();
    return plainToClass(Team, team);
  }

  async checkCodeId(
    id: string,
    code: string,
    cRegion: Region,
  ): Promise<boolean> {
    const region = await this.TeamModel.find({
      code,
      region: cRegion,
      _id: { $ne: id },
    })
      .lean()
      .exec();
    return region.length ? true : false;
  }
}
