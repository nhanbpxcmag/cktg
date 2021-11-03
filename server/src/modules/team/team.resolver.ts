import { ERROR_CONSTANT } from './../../constants';
import { HttpStatus, BadRequestException } from '@nestjs/common';
import { IError } from './../../common/interfaces/error.interface';
import { Team } from './schemas/team.schema';
import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { CreateTeamInput, UpdateTeamInput } from './dto/team.input';
import { TeamService } from './team.service';
import { Public } from 'src/shared/decorators/isPublic.decorator';

@Resolver('team')
export class TeamResolver {
  constructor(private readonly teamService: TeamService) {}

  @Query((returns) => [Team], { nullable: true })
  @Public()
  async teams(): Promise<Team[]> {
    const Teams = await this.teamService.teams();
    return Teams;
  }

  @Query((returns) => Team)
  @Public()
  async team(@Args('_id') _id: string): Promise<Team> {
    const Team = await this.teamService.findById(_id);
    return Team;
  }

  @Mutation((returns) => Team)
  // @Permissions(IPermission.Admin)
  async createTeam(
    @Args('createTeamInput') createTeamInput: CreateTeamInput,
  ): Promise<Team> {
    const newTeam = await this.teamService.create(createTeamInput);
    return newTeam;
  }

  @Mutation((returns) => Team)
  async updateTeam(
    @Args('updateTeamInput') updateTeamInput: UpdateTeamInput,
  ): Promise<Team> {
    return this.teamService.update(updateTeamInput);
  }

  @Mutation((returns) => Boolean)
  async deleteTeam(@Args('_id') _id: string): Promise<boolean> {
    const deleteTeam = await this.teamService.delete(_id);
    if (!deleteTeam) {
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
