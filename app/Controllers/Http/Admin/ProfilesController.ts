import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, validator, rules } from "@ioc:Adonis/Core/Validator";
import Hash from "@ioc:Adonis/Core/Hash";
import Config from "@ioc:Adonis/Core/Config";
import Database from "@ioc:Adonis/Lucid/Database";
import User from "App/Models/User";

const tokenExpiry = Config.get("token_expiry", 1000 * 60 * 100); // 10 minutes default

export default class ProfileController {
  public async updateProfile({ auth, response, request }: HttpContextContract) {
    let user = await auth.user!;

    let data = request.all();

    let customErrors = {};
    try {
      await validator.validate({
        schema: schema.create({
          old_password: schema.string({}, [
            rules.minLength(8),
            rules.requiredIfExists("password"),
          ]),
          password: schema.string({}, [rules.minLength(8), rules.confirmed()]),
          email: schema.string({}, [rules.email()]),
        }),
        data,
      });
    } catch (e) {
      customErrors = e.messages;
    }

    if (data.old_password) {
      let verify = false;
      try {
        verify = await Hash.verify(data.old_password, user.password);
      } catch (e) {
        verify = true;
      }

      if (!verify) {
        customErrors["old_password"] = customErrors["old_password"] || [];
        customErrors["old_password"].push("Provided password is incorrect");
      }
    }

    if (Object.keys(customErrors).length) {
      return response.status(422).send({ errors: customErrors });
    }

    let updateObj: any = {};
    updateObj.email = data.email;
    if (data.password) {
      updateObj.password = await Hash.make(data.password);
    }

    let prevEmail = user.email;
    Database.from(User.table)
      .where(User.primaryKey, user.$primaryKeyValue as string)
      .update(updateObj);

    let msg = `Your password${
      data.email !== prevEmail ? " and email" : ""
    } has been updated successfully.`;
    msg += ` You'll be required to login wuth new details next time`;

    response.send({ message: msg });
  }

  public async show({ auth, response }: HttpContextContract) {
    let user = await auth.user!;

    return response.send({ data: user });
  }

  public async login({ auth, response, request }: HttpContextContract) {
    let data = request.all();

    let customErrors = [];
    try {
      await validator.validate({
        schema: schema.create({
          password: schema.string({}, [rules.minLength(8)]),
          email: schema.string({}, [rules.email()]),
        }),
        data,
      });
    } catch (e) {
      customErrors = e.messages;
    }

    if (Object.keys(customErrors).length) {
      return response.status(422).send({ errors: customErrors });
    }

    let token = {};
    try {
      token = await auth.attempt(data.email, data.password, {
        expiresIn: tokenExpiry,
      });
      return response.send({ data: token });
    } catch (e) {
      return response.status(401).send({ message: "Login failed" });
    }
  }

  public async refresh({ auth, response }: HttpContextContract) {
    let user = await auth.user!;

    // refresh tokens and invalidate old tokens
    let result = await Promise.all([
      auth.use("api").revoke(),
      auth.use("api").generate(user, { expiresIn: tokenExpiry }),
    ]);

    return response.send(result[1]);
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout();
    return response.status(204).send("");
  }
}
