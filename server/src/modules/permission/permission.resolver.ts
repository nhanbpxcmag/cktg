import { Resolver } from '@nestjs/graphql';
import { PermissionService } from './permission.service';

@Resolver('Permission')
export class PermissionResolver {
  constructor(private readonly permissionService: PermissionService) {}
}
