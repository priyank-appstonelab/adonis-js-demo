import { Attachment } from "@ioc:Adonis/Addons/AttachmentLite";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import User from "App/Models/User";
import CreateUserValidator from "App/Validators/CreateUserValidator";
import UpdateUserValidator from "App/Validators/UpdateUserValidator";
// import Logger from "@ioc:Adonis/Core/Logger";

export default class UsersController {
  public async index({ request, response }: HttpContextContract) {
    const user = await User.query().paginate(
      request.qs().page,
      request.qs().limit
    );
    return response.send({
      message: "Users retrieved successfully",
      data: user.serialize(),
    });
  }

  public async store({ request, response }: HttpContextContract) {
    // try {
    const data = await request.validate(CreateUserValidator);

    const avatarImage = request.file("avatar");

    if (avatarImage) {
      //   await avatarImage.move(Application.tmpPath("uploads"), {
      //     name: "user-" + Date.now() + "." + avatarImage.extname,
      //   });
      //   data.avatar_url = avatarImage.fileName;
      data.avatar = Attachment.fromFile(avatarImage) as any;
    }

    const user = await User.create(data as any);

    // insert multiple addresses for users
    if (data.address && data.address.length > 0) {
      user.related("address").createMany(data.address);
    }

    return response.send({
      message: "User created successfully",
      data: user.serialize(),
    });
    // } catch (e) {
    //   return response.abort({ message: e.message }, 400);
    // }
  }

  public async show({ request, response }: HttpContextContract) {
    const id = request.param("id");
    const user = await User.find(id);
    if (!user) {
      return response.notFound({ message: "User not found" });
    }
    await user.load("address");
    return response.send({
      message: "User retrieved successfully",
      data: user?.serialize(),
    });
  }

  public async update({ request, response }: HttpContextContract) {
    const id = request.param("id");

    const user = await User.query().where("id", id).first();
    if (!user) {
      return response.notFound({ message: "User not found" });
    }

    const data = await request.validate(UpdateUserValidator);

    const avatarImage = request.file("avatar");
    if (avatarImage) {
      //   await avatarImage.move(Application.tmpPath("uploads"), {
      //     name: "user-" + Date.now() + "." + avatarImage.extname,
      //   });

      //   user.avatarUrl = avatarImage.fileName as string;
      user.avatar = Attachment.fromFile(avatarImage);
    }

    // insert multiple addresses for users
    if (data.address && data.address.length > 0) {
      data.address.forEach((element) => {
        user.related("address").updateOrCreate({ id: element.id }, element);
      });
    }

    user.name = data.name;
    user.email = data.email;
    await user.save();

    return response.send({
      message: "User updated successfully",
      data: user.serialize(),
    });
  }

  public async destroy({ request, response }: HttpContextContract) {
    const id = request.param("id");

    const user = await User.query().where("id", id).first();
    if (!user) {
      return response.notFound({ message: "User not found" });
    }
    user.delete();
    return response.send({
      message: "User deleted successfully",
      data: user.serialize(),
    });
  }

  public async notifications({ response, auth }: HttpContextContract) {
    const user = auth.user;

    if (!user) {
      return response.notFound({ message: "User not found" });
    }

    return response.send({
      message: "Notifications",
      data: await user?.unreadNotifications(),
    });
  }
}
