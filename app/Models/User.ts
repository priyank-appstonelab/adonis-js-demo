import { DateTime } from "luxon";
import {
  BaseModel,
  HasMany,
  HasManyThrough,
  ManyToMany,
  beforeSave,
  column,
  hasMany,
  hasManyThrough,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Hash from "@ioc:Adonis/Core/Hash";
import Address from "./Address";
import {
  AttachmentContract,
  attachment,
} from "@ioc:Adonis/Addons/AttachmentLite";
import { SoftDeletes } from "@ioc:Adonis/Addons/LucidSoftDeletes";
import { compose } from "@ioc:Adonis/Core/Helpers";
import { Notifiable } from "@ioc:Verful/Notification/Mixins";
import { LucidHashIds } from "@ioc:Adonis/Addons/LucidHashIds";
import Role from "./Role";
import UserRole from "./UserRole";

export default class User extends compose(
  BaseModel,
  SoftDeletes,
  Notifiable("notifications"),
  LucidHashIds
) {
  static allowedRelationships() {}

  @column({ isPrimary: true })
  public id: number;

  @column()
  public hashid: string | null;

  @column()
  public name: string;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  // @column({
  //   serialize: (value: string | null) => {
  //     return value ? API_URL + ("/uploads/" + value) : null;
  //   },
  // })
  // public avatarUrl: string | null;

  @attachment({ preComputeUrl: true })
  public avatar: AttachmentContract | null;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
  $dirty: any;

  @column.dateTime()
  public deletedAt: DateTime | null;

  @beforeSave()
  public static async hashPassword(User: User) {
    if (User.$dirty.password) {
      User.password = await Hash.make(User.password);
    }
  }

  @hasMany(() => Address)
  public address: HasMany<typeof Address>;

  @manyToMany(() => Role, {
    pivotTable: "user_roles",
  })
  public roles: ManyToMany<typeof Role>;
}
