import { IPermission } from './../../common/interfaces/permission.enum';
import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: IPermission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
