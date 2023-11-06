import { compose } from "@ioc:Adonis/Core/Helpers";
import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { SoftDeletes } from "@ioc:Adonis/Addons/LucidSoftDeletes";

export default class Address extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number | null;

  @column()
  public userId: number;

  @column()
  public addressType: string;

  @column()
  public addressLine1: string;

  @column()
  public addressLine2: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @column.dateTime()
  public deletedAt: DateTime | null;
}
