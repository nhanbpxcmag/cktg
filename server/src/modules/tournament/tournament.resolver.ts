import { ERROR_CONSTANT } from './../../constants';
import { HttpStatus, BadRequestException } from '@nestjs/common';
import { IError } from './../../common/interfaces/error.interface';
import { Tournament } from './schemas/tournament.schema';
import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import {
  CreateTournamentInput,
  UpdateTournamentInput,
} from './dto/tournament.input';
import { TournamentService } from './tournament.service';
import { Public } from 'src/shared/decorators/isPublic.decorator';

@Resolver('tournament')
export class TournamentResolver {
  constructor(private readonly tournamentService: TournamentService) {}

  @Query((returns) => [Tournament], { nullable: true })
  @Public()
  async tournaments(): Promise<Tournament[]> {
    const Tournaments = await this.tournamentService.tournaments();
    return Tournaments;
  }

  @Query((returns) => Tournament)
  @Public()
  async tournament(@Args('_id') _id: string): Promise<Tournament> {
    const Tournament = await this.tournamentService.findById(_id);
    return Tournament;
  }

  @Mutation((returns) => Tournament)
  // @Permissions(IPermission.Admin)
  async createTournament(
    @Args('createTournamentInput') createTournamentInput: CreateTournamentInput,
  ): Promise<Tournament> {
    const newTournament = await this.tournamentService.create(
      createTournamentInput,
    );
    return newTournament;
  }

  @Mutation((returns) => Tournament)
  async updateTournament(
    @Args('updateTournamentInput') updateTournamentInput: UpdateTournamentInput,
  ): Promise<Tournament> {
    return this.tournamentService.update(updateTournamentInput);
  }

  @Mutation((returns) => Boolean)
  async deleteTournament(@Args('_id') _id: string): Promise<boolean> {
    const deleteTournament = await this.tournamentService.delete(_id);
    if (!deleteTournament) {
      const message: IError = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: [
          {
            value: _id,
            property: '_id',
            constraints: {
              usernameOrEmail: `Giải đấu đã được xóa hoặc không tồn tại`,
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
