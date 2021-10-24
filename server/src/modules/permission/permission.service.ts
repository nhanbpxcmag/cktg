import { plainToClass } from 'class-transformer';
import { CreatePermissionInput } from './dto/permission.input';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
  ) {}
  async create(
    createPermissionInput: CreatePermissionInput,
  ): Promise<Permission> {
    const { code, name } = createPermissionInput;
    const newPermission: PermissionDocument = await new this.permissionModel({
      code,
      name,
    }).save();
    return plainToClass(Permission, newPermission.toObject());
  }

  async findById(id: string): Promise<Permission> {
    const newPermission = await this.permissionModel.findById(id).lean().exec();
    return plainToClass(Permission, newPermission);
  }

  async findByCode(code: string): Promise<Permission> {
    const newPermission = await this.permissionModel
      .findOne({ code })
      .lean()
      .exec();
    return plainToClass(Permission, newPermission);
  }
}
