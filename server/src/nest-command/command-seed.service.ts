import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { Command } from 'nestjs-command';
import { UserService } from 'src/modules/user/user.service';
import { PermissionService } from './../modules/permission/permission.service';
import { RoleService } from './../modules/role/role.service';

@Injectable()
export class SeedCommand {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  @Command({
    command: 'create:role',
    describe: 'create a role permission',
  })
  async create() {
    const { users, permissions, roles, rolePermissions, roleUsers } =
      JSON.parse(
        await readFile('./src/nest-command/data/role-permission.json', 'utf8'),
      );
    for (const user of users) {
      const { username, email, password, firstName, lastName } = user;
      await this.userService.create(
        {
          username,
          email,
          password,
          firstName,
          lastName,
        },
        false,
      );
    }
    for (const role of roles) {
      const { code, name } = role;
      if (code) {
        const existing = await this.roleService.findByCode(code);
        if (!existing) {
          await this.roleService.create({ code, name });
        }
      }
    }
    for (const permission of permissions) {
      const { code, name } = permission;
      if (code) {
        const existing = await this.permissionService.findByCode(code);
        if (!existing) {
          await this.permissionService.create({ code, name });
        }
      }
    }
    for (const rolePermission of rolePermissions) {
      const { role, permission } = rolePermission;
      await this.roleService.createRolePermissionsByCode(role, permission);
    }
    for (const roleUser of roleUsers) {
      const { role, username } = roleUser;
      await this.roleService.createRoleUsersByRoleCodeUsername(role, username);
    }
  }
}
