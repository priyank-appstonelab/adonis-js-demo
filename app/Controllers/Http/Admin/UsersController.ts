import {
  ResponseContract,
  HttpContextContract,
} from "@ioc:Adonis/Core/HttpContext";
import { schema, rules, validator } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";
import moment from "moment";

const tableColumns = [
  "id",
  "hashid",
  "name",
  "email",
  "remember_me_token",
  "password",
  "avatar",
  "avatar_url",
  "created_at",
  "updated_at",
  "deleted_at",
];
const allowedRelationships = User.allowedRelationships();

/**
 * Resourceful controller for interacting with users
 */
export default class UsersController {
  /**
   * Show a list of all users.
   * GET /admin/users
   *
   */
  public async index({
    request,
    response,
  }: HttpContextContract): ResponseContract {
    let qs = request.qs();
    let query = User.query();

    if (qs.id) {
      query.where("id", qs.id);
    }

    if (qs.hashid) {
      query.where("hashid", "LIKE", "%" + qs.hashid + "%");
    }

    if (qs.name) {
      query.where("name", "LIKE", "%" + qs.name + "%");
    }

    if (qs.email) {
      query.where("email", "LIKE", "%" + qs.email + "%");
    }

    if (qs.remember_me_token) {
      query.where(
        "remember_me_token",
        "LIKE",
        "%" + qs.remember_me_token + "%"
      );
    }

    if (qs.avatar) {
      query.where("avatar", "LIKE", "%" + qs.avatar + "%");
    }

    if (qs.avatar_url) {
      query.where("avatar_url", "LIKE", "%" + qs.avatar_url + "%");
    }

    if (qs.created_at_from) {
      query.where(
        "created_at",
        ">=",
        moment(qs.created_at).format("YYYY-MM-DD HH:mm:ss")
      );
    }
    if (qs.created_at_to) {
      query.where(
        "created_at",
        "<=",
        moment(qs.created_at).format("YYYY-MM-DD HH:mm:ss")
      );
    }

    if (qs.updated_at_from) {
      query.where(
        "updated_at",
        ">=",
        moment(qs.updated_at).format("YYYY-MM-DD HH:mm:ss")
      );
    }
    if (qs.updated_at_to) {
      query.where(
        "updated_at",
        "<=",
        moment(qs.updated_at).format("YYYY-MM-DD HH:mm:ss")
      );
    }

    if (qs.deleted_at_from) {
      query.where(
        "deleted_at",
        ">=",
        moment(qs.deleted_at).format("YYYY-MM-DD HH:mm:ss")
      );
    }
    if (qs.deleted_at_to) {
      query.where(
        "deleted_at",
        "<=",
        moment(qs.deleted_at).format("YYYY-MM-DD HH:mm:ss")
      );
    }

    if (qs.with) {
      let requestedRelationships = qs.with ? qs.with.split(",") : [];
      for (let relationship of requestedRelationships) {
        if (allowedRelationships.includes(relationship)) {
          query.preload(relationship);
        }
      }
    }

    let orderBy = User.primaryKey;
    let order: "desc" | "asc" = "desc";
    if (qs.sort) {
      let split = qs.sort.split("|");

      if (
        tableColumns.includes(split[0]) &&
        ["desc", "asc"].includes(split[1].toLowerCase())
      ) {
        orderBy = split[0];
        order = split[1].toLowerCase();
      }
    }
    query.orderBy(orderBy, order);

    let data = await query.paginate(qs.page || 1, qs.per_page || 25);

    return response.send(data);
  }

  /**
   * Create/save a new user.
   * POST /admin/users
   *
   */
  public async store({
    params,
    request,
    response,
  }: HttpContextContract): ResponseContract {
    const data = request.only([
      "hashid",
      "name",
      "email",
      "remember_me_token",
      "password",
      "avatar",
      "avatar_url",
      "created_at",
      "updated_at",
      "deleted_at",
    ]);

    let validationErrors = {};
    try {
      await validator.validate({
        schema: schema.create({
          hashid: schema.string.optional({}, [rules.maxLength(255)]),
          name: schema.string.optional({}, [rules.maxLength(255)]),
          email: schema.string.optional({}, [
            rules.maxLength(255),
            rules.unique(
              Object.keys(params).length > 0
                ? {
                    table: "users",
                    column: "email",
                    caseInsensitive: true,
                    where: {
                      email: params.email,
                    },
                  }
                : {
                    table: "users",
                    column: "email",
                    caseInsensitive: true,
                  }
            ),
            rules.email(),
          ]),
          remember_me_token: schema.string.optional({}, [rules.maxLength(255)]),
          password: schema.string.optional({}, [
            rules.maxLength(255),
            rules.minLength(8),
          ]),
          avatar: schema.string.optional({}, []),
          avatar_url: schema.string.optional({}, [rules.maxLength(255)]),
        }),
        data,
      });
    } catch (e) {
      validationErrors = e.messages;
    }

    if (Object.keys(validationErrors).length) {
      return response.status(422).send({ errors: validationErrors });
    }

    let user = await User.create(data);
    let message = "User created successfully";

    return response.status(201).send({ message, data: user });
  }

  /**
   * Display a single user.
   * GET /admin/users/:id
   *
   */
  public async show({
    params,
    response,
  }: HttpContextContract): ResponseContract {
    let user = await User.findOrFail(params[User.primaryKey]);

    let data = { data: user };

    return response.send(data);
  }

  /**
   * Update user details.
   * PATCH /admin/users/:id
   *
   */
  public async update({
    params,
    request,
    response,
  }: HttpContextContract): ResponseContract {
    const data = request.only([
      "hashid",
      "name",
      "email",
      "remember_me_token",
      "password",
      "avatar",
      "avatar_url",
      "created_at",
      "updated_at",
      "deleted_at",
    ]);
    let validationErrors = {};
    try {
      await validator.validate({
        schema: schema.create({
          hashid: schema.string.optional({}, [rules.maxLength(255)]),
          name: schema.string.optional({}, [rules.maxLength(255)]),
          email: schema.string.optional({}, [
            rules.maxLength(255),
            rules.unique(
              Object.keys(params).length > 0
                ? {
                    table: "users",
                    column: "email",
                    caseInsensitive: true,
                    where: {
                      email: params.email,
                    },
                  }
                : {
                    table: "users",
                    column: "email",
                    caseInsensitive: true,
                  }
            ),
            rules.email(),
          ]),
          remember_me_token: schema.string.optional({}, [rules.maxLength(255)]),
          password: schema.string.optional({}, [
            rules.maxLength(255),
            rules.minLength(8),
          ]),
          avatar: schema.string.optional({}, []),
          avatar_url: schema.string.optional({}, [rules.maxLength(255)]),
        }),
        data,
      });
    } catch (e) {
      validationErrors = e.messages;
    }

    if (Object.keys(validationErrors).length) {
      return response.status(422).send({ errors: validationErrors });
    }

    let user = await User.findOrFail(params[User.primaryKey]);
    let filledData = {};
    Object.keys(data).forEach((input) => {
      if (data[input]) filledData[input] = data[input];
    });

    user.merge(filledData);
    await user.save();

    let message = "User updated successfully";

    return response.status(200).send({ message, data: user });
  }

  /**
   * Delete a user with id.
   * DELETE /admin/users/:id
   *
   */
  public async destroy({
    params,
    response,
  }: HttpContextContract): ResponseContract {
    let user = await User.findOrFail(params[User.primaryKey]);

    user.delete();

    return response.status(204).send("");
  }
}
