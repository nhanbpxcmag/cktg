import { RoleUser, RoleUserDocument } from './schemas/role-user.schema';
import { UserService } from 'src/modules/user/user.service';
import { PermissionService } from './../permission/permission.service';
import {
  RolePermission,
  RolePermissionDocument,
} from './schemas/role-permission.schema';
import { plainToClass } from 'class-transformer';
import { CreateRoleInput } from './dto/role.input';
import { Role, RoleDocument } from './schemas/role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import mongoose from 'mongoose';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<RoleDocument>,
    @InjectModel(RolePermission.name)
    private rolePermissionModel: Model<RolePermissionDocument>,
    @InjectModel(RoleUser.name)
    private roleUserModel: Model<RoleUserDocument>,
    private readonly permissionService: PermissionService,
    private readonly userService: UserService,
  ) {}
  async create(createRoleInput: CreateRoleInput): Promise<Role> {
    const { code, name } = createRoleInput;
    const newRole: RoleDocument = await new this.roleModel({
      code,
      name,
    }).save();
    return plainToClass(Role, newRole.toObject());
  }

  async createRolePermissionsByCode(
    codeRole: string,
    codePermission: string,
  ): Promise<RolePermission | null> {
    const role = await this.findByCode(codeRole);
    if (!role) return null;

    const permission = await this.permissionService.findByCode(codePermission);
    if (
      !permission ||
      (await this.rolePermissionModel.findOne({ role, permission }))
    )
      return null;

    const newRolePermission = await new this.rolePermissionModel({
      role,
      permission,
    }).save();
    return plainToClass(RolePermission, newRolePermission.toObject());
  }

  async createRoleUsersByRoleCodeUsername(
    codeRole: string,
    username: string,
  ): Promise<RoleUser | null> {
    const role = await this.findByCode(codeRole);
    if (!role) return null;

    const user = await this.userService.getUserByUsername(username);

    if (!user || (await this.roleUserModel.findOne({ role, user }))) {
      return null;
    }
    const newRoleUser = await new this.roleUserModel({
      role,
      user,
    }).save();
    return plainToClass(RoleUser, newRoleUser.toObject());
  }

  async findById(id: string): Promise<Role> {
    const role = await this.roleModel.findById(id).lean().exec();
    return plainToClass(Role, role);
  }

  async findByCode(code: string): Promise<Role> {
    const role = await this.roleModel.findOne({ code }).lean().exec();
    return plainToClass(Role, role);
  }
}
