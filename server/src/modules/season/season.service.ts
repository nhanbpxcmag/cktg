import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
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
import { CreateSeasonInput, UpdateSeasonInput } from './dto/Season.input';
import { Season, SeasonDocument } from './schemas/Season.schema';

@Injectable()
export class SeasonService {
  constructor(
    @InjectModel(Season.name)
    private readonly SeasonModel: Model<SeasonDocument>,
    private readonly tournamentService: TournamentService,
  ) {}

  async Seasons(): Promise<Season[]> {
    const Seasons = await this.SeasonModel.find()
      .populate({
        path: 'tournament',
        model: Tournament.name,
      })
      .lean()
      .exec();
    return plainToClass(Season, Seasons);
  }

  async validateCreate(Season: CreateSeasonInput) {
    const { code, name, number, tournamentId } = Season;
    const errorMessage: IErrorMessage[] = [];
    const Seasons = await this.SeasonModel.findOne({ code }).lean().exec();
    //check tournament
    const cTournament = await this.tournamentService.findById(tournamentId);

    if (Seasons) {
      errorMessage.push({
        value: code,
        property: 'code',
        constraints: {
          usernameOrEmail: `Mã mùa giải tồn tại`,
        },
      });
    }

    if (!cTournament) {
      errorMessage.push({
        value: tournamentId,
        property: 'tournamentId',
        constraints: {
          usernameOrEmail: `Giải đấu không tồn tại`,
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
    const { code, name, number, tournamentId } = Season;

    await this.validateCreate(Season);

    const newSeason = await new this.SeasonModel({
      code,
      name,
      number,
      tournament: tournamentId,
    }).save();

    await newSeason.populate({
      path: 'tournament',
      model: Tournament.name,
    });

    return newSeason;
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
          usernameOrEmail: `_id giải đấu đã bị xóa hoặc không tồn tại`,
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
    if (await this.checkCodeId(_id, code)) {
      errorMessage.push({
        value: code,
        property: 'code',
        constraints: {
          usernameOrEmail: `Mã giải đấu đã tồn tại`,
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
    const { _id, code, name, number, tournamentId } = updateSeasonInput;

    const { existingSeason, cTournament } = await this.validateUpdate(
      updateSeasonInput,
    );

    existingSeason.code = code;
    existingSeason.name = name;
    existingSeason.number = number;
    existingSeason.tournament = cTournament;
    existingSeason.save();

    return existingSeason;
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
