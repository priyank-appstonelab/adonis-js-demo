import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Config from "@ioc:Adonis/Core/Config";
import Database from "@ioc:Adonis/Lucid/Database";
import User from "App/Models/User";

const permissionTable = Config.get(
  "rolePermission.permission_table",
  "permissions"
);
const userPermissionTable = Config.get(
  "rolePermission.user_permission_table",
  "user_permissions"
);
const rolePermissionTable = Config.get(
  "rolePermission.role_permission_table",
  "role_permissions"
);

/**
 * Permission authentication to check if user has any of the specified permissions
 *
 * Should be called after auth middleware
 */
export default class Can {
  /**
   * Handle request
   */
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    permissionNames: string[]
  ) {
    /**
     * Check if user is logged-in
     */
    let user = await auth.user;
    if (!user) {
      return response.unauthorized({ error: "Must be logged in" });
    }
    let hasRole = await this.checkHasRoles(auth.user!, permissionNames);
    if (!hasRole) {
      return response.unauthorized({
        error: `Doesn't have required role(s): ${permissionNames.join(",")}`,
      });
    }
    await next();
  }

  private async checkHasRoles(
    user: User,
    permissionNames: Array<string>
  ): Promise<boolean> {
    let rolePlaceHolder = "(";
    let placeholders = new Array(permissionNames.length).fill("?");
    rolePlaceHolder += placeholders.join(",");
    rolePlaceHolder += ")";

    await user.load("roles");

    let roleIds = user.roles.map((x: { id: any }) => x.id);
    let roleIdPlaceHolder =
      "(" + new Array(roleIds.length).fill("?").join(",") + ")";

    let {
      0: {
        0: { permissionCount },
      },
    } = await Database.rawQuery(
      "SELECT count(`rp`.`id`) as permissionCount FROM " +
        rolePermissionTable +
        " rp INNER JOIN " +
        permissionTable +
        " p ON rp.permission_id=p.id WHERE `rp`.`role_id` in " +
        roleIdPlaceHolder +
        " AND `p`.`name` in " +
        rolePlaceHolder +
        " LIMIT 1",
      [...roleIds, ...permissionNames]
    );
    if (!permissionCount) {
      let {
        0: {
          0: { permissionCount },
        },
      } = await Database.rawQuery(
        "SELECT count(`up`.`id`) as permissionCount FROM " +
          userPermissionTable +
          " up INNER JOIN " +
          permissionTable +
          " p ON up.permission_id=p.id WHERE `up`.`user_id`=? AND `p`.`name` in " +
          rolePlaceHolder +
          " LIMIT 1",
        [user.id, ...permissionNames]
      );

      return permissionCount > 0;
    }
    return permissionCount;
  }
}
