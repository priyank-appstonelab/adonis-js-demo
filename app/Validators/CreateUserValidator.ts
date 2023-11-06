import { schema, rules, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string([ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string([
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    name: schema.string([rules.trim(), rules.maxLength(255)]),
    email: schema.string([
      rules.trim(),
      rules.email(),
      rules.unique({ table: "users", column: "email" }),
      rules.maxLength(255),
    ]),
    password: schema.string([
      rules.trim(),
      rules.minLength(4),
      rules.maxLength(20),
      rules.confirmed(),
    ]),
    avatar: schema.file.nullableAndOptional({
      size: "2mb",
      extnames: ["jpg", "jpeg", "png"],
    }),

    address: schema.array().members(
      schema.object().members({
        id: schema.number.nullableAndOptional(),
        addressType: schema.string.optional(),
        addressLine1: schema.string.optional(),
        addressLine2: schema.string.optional(),
      })
    ),
  });

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    required: "The {{field}} is required",
  };
}
