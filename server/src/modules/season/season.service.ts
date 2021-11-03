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
import { TournamentService } from './../tournament/tournament.service';
import { Tournament } from './../tournament/schemas/tournament.schema';
import { CreateSeasonInput, UpdateSeasonInput } from './dto/season.input';
import { Season, SeasonDocument } from './schemas/season.schema';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class SeasonService {
  constructor(
    @InjectModel(Season.name)
    private readonly SeasonModel: Model<SeasonDocument>,
    private readonly tournamentService: TournamentService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  async seasons(): Promise<Season[]> {
    const Seasons = await this.SeasonModel.find()
      .populate({
        path: 'tournament',
        model: Tournament.name,
        populate: {
          path: 'region',
          model: Region.name,
        },
      })
      .lean()
      .exec();
    return plainToClass(Season, Seasons);
  }

  async validateCreate(Season: CreateSeasonInput) {
    const { code, name, number, tournamentId } = Season;
    const errorMessage: IErrorMessage[] = [];
    const season = await this.SeasonModel.findOne({ code }).lean().exec();

    if (season) {
      errorMessage.push({
        value: code,
        property: 'code',
        constraints: {
          usernameOrEmail: `Mã mùa giải tồn tại`,
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

  async create(Season: CreateSeasonInput): Promise<Season> {
    const { code, name, description, year, number, tournamentId } = Season;

    await this.validateCreate(Season);
    const session = await this.SeasonModel.db.startSession();
    session.startTransaction();
    try {
      const newSeason = await new this.SeasonModel({
        code,
        name,
        description,
        year,
        number,
        tournament: tournamentId,
      }).save();

      await newSeason.populate({
        path: 'tournament',
        model: Tournament.name,
        populate: {
          path: 'region',
          model: Region.name,
        },
      });
      await session.commitTransaction();
      session.endSession();
      return newSeason;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      this.logger.error(error, { ...Season, actionService: 'create' });
    }
  }

  async validateUpdate(updateSeasonInput: UpdateSeasonInput) {
    const { _id, code, name, number, tournamentId } = updateSeasonInput;
    const errorMessage: IErrorMessage[] = [];

    const existingSeason = await this.SeasonModel.findById(_id).populate({
      path: 'tournament',
      model: Tournament.name,
    });
    const cTournament = await this.tournamentService.findById(tournamentId);

    if (!existingSeason) {
      errorMessage.push({
        value: _id,
        property: '_id',
        constraints: {
          usernameOrEmail: `_id mùa giải đã bị xóa hoặc không tồn tại`,
        },
      });
    }
    if (await this.checkCodeId(_id, code)) {
      errorMessage.push({
        value: code,
        property: 'code',
        constraints: {
          usernameOrEmail: `Mã mùa giải đã tồn tại`,
        },
      });
    }
    if (!cTournament) {
      errorMessage.push({
        value: tournamentId,
        property: 'tournamentId',
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

    return { existingSeason, cTournament };
  }

  async update(updateSeasonInput: UpdateSeasonInput): Promise<Season> {
    const { _id, code, name, description, year, number, tournamentId } =
      updateSeasonInput;

    const { existingSeason, cTournament } = await this.validateUpdate(
      updateSeasonInput,
    );
    const session = await this.SeasonModel.db.startSession();
    session.startTransaction();
    try {
      existingSeason.code = code;
      existingSeason.name = name;
      existingSeason.description = description;
      existingSeason.year = year;
      existingSeason.number = number;
      existingSeason.tournament = cTournament;
      existingSeason.save();
      await session.commitTransaction();
      session.endSession();
      return existingSeason;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      this.logger.error(error, { ...Season, actionService: 'update' });
    }
  }

  async delete(_id: string): Promise<boolean> {
    const deleteSeason = await this.SeasonModel.deleteOne({ _id })
      .lean()
      .exec();
    return deleteSeason.deletedCount ? true : false;
  }

  async findById(id: string): Promise<Season> {
    const season = this.SeasonModel.findById(id)
      .populate({
        path: 'tournament',
        model: Tournament.name,
        populate: {
          path: 'region',
          model: Region.name,
        },
      })
      .lean()
      .exec();
    return plainToClass(Season, season);
  }

  async checkCodeId(id: string, code: string): Promise<boolean> {
    const tournament = await this.SeasonModel.find({
      code,
      _id: { $ne: id },
    })
      .lean()
      .exec();
    return tournament.length ? true : false;
  }
}
