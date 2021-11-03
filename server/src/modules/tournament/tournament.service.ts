import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { Model } from 'mongoose';
import {
  IError,
  IErrorMessage,
} from './../../common/interfaces/error.interface';
import { ERROR_CONSTANT } from './../../constants';
import { RegionService } from './../region/region.service';
import { Region } from './../region/schemas/region.schema';
import {
  CreateTournamentInput,
  UpdateTournamentInput,
} from './dto/tournament.input';
import { Tournament, TournamentDocument } from './schemas/tournament.schema';

@Injectable()
export class TournamentService {
  constructor(
    @InjectModel(Tournament.name)
    private readonly tournamentModel: Model<TournamentDocument>,
    private readonly regionService: RegionService,
  ) {}

  async tournaments(): Promise<Tournament[]> {
    const tournaments = await this.tournamentModel
      .find()
      .populate({
        path: 'region',
        model: Region.name,
      })
      .lean()
      .exec();

    /* const tournaments1 = await this.tournamentModel
      .aggregate()
      .lookup({
        from: 'regions',
        localField: 'region',
        foreignField: '_id',
        as: 'regions1',
      })
      .match({
        'regions1.code': 'KR',
        code: 'LCK'
      });
    tournaments1.map((tournaments2) => {
      console.log(
        '🚀 ~ file: tournament.service.ts ~ line 42 ~ TournamentService ~ tournaments ~ tournaments1',
        tournaments2,
      );
    }); */
    return plainToClass(Tournament, tournaments);
  }

  async validateCreate(tournament: CreateTournamentInput) {
    const { code, name, number, international, regionId } = tournament;
    const errorMessage: IErrorMessage[] = [];
    const tournaments = await this.tournamentModel
      .findOne({ code })
      .lean()
      .exec();
    //check region
    const cRegion = await this.regionService.findById(regionId);

    if (tournaments) {
      errorMessage.push({
        value: code,
        property: 'code',
        constraints: {
          usernameOrEmail: `Mã giải đấu tồn tại`,
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

  async create(tournament: CreateTournamentInput): Promise<Tournament> {
    const { code, name, number, international, regionId } = tournament;

    await this.validateCreate(tournament);

    const newTournament = await new this.tournamentModel({
      code,
      name,
      number,
      international,
      region: regionId,
    }).save();

    await newTournament.populate({
      path: 'region',
      model: Region.name,
    });

    return newTournament;
  }

  async validateUpdate(updateTournamentInput: UpdateTournamentInput) {
    const { _id, code, name, number, regionId } = updateTournamentInput;
    const errorMessage: IErrorMessage[] = [];

    const existingTournament = await this.tournamentModel
      .findById(_id)
      .populate({
        path: 'region',
        model: Region.name,
      });
    const cRegion = await this.regionService.findById(regionId);

    if (!existingTournament) {
      errorMessage.push({
        value: _id,
        property: '_id',
        constraints: {
          usernameOrEmail: `_id giải đấu đã bị xóa hoặc không tồn tại`,
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

    return { existingTournament, cRegion };
  }

  async update(
    updateTournamentInput: UpdateTournamentInput,
  ): Promise<Tournament> {
    const { _id, code, name, number, international, regionId } =
      updateTournamentInput;

    const { existingTournament, cRegion } = await this.validateUpdate(
      updateTournamentInput,
    );

    existingTournament.code = code;
    existingTournament.name = name;
    existingTournament.number = number;
    existingTournament.international = international;
    existingTournament.region = cRegion;
    existingTournament.save();

    return existingTournament;
  }

  async delete(_id: string): Promise<boolean> {
    const deleteTournament = await this.tournamentModel
      .deleteOne({ _id })
      .lean()
      .exec();
    return deleteTournament.deletedCount ? true : false;
  }

  async findById(id: string): Promise<Tournament> {
    const tournament = this.tournamentModel
      .findById(id)
      .populate({
        path: 'region',
        model: Region.name,
      })
      .lean()
      .exec();
    return plainToClass(Tournament, tournament);
  }

  async checkCodeId(id: string, code: string): Promise<boolean> {
    const region = await this.tournamentModel
      .find({
        code,
        _id: { $ne: id },
      })
      .lean()
      .exec();
    return region.length ? true : false;
  }
}
