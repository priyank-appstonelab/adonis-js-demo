import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Helper from "App/Helpers";
import ForgotPasswordMailer from "App/Mailers/ForgotPasswordMailer";
import User from "App/Models/User";
import TestNotification from "App/Notifications/TestNotification";
import EmailValidator from "App/Validators/EmailValidator";
import LoginUserValidator from "App/Validators/LoginUserValidator";
import RegisterUserValidator from "App/Validators/RegisterUserValidator";

export default class AuthController {
  constructor() {}
  public async me({ auth }: HttpContextContract) {
    return {
      message: "User retrieved successfully",
      data: auth.user,
    };
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const data = await request.validate(LoginUserValidator);

    const user = await User.findBy("email", data.email);
    if (!user) {
      return response.abort(
        Helper.sendError("Invalid email or password", null, 400)
      );
    }
    try {
      const token = await auth.use("api").attempt(data.email, data.password);
      return response.send(Helper.sendError("Login Successful ", token, 200));
    } catch {
      return response.abort(Helper.sendError("Invalid credentials", null, 400));
    }
  }

  public async register({ request, auth, response }: HttpContextContract) {
    const data = await request.validate(RegisterUserValidator);

    const user = await User.create(data);
    user.notify(new TestNotification());

    try {
      const token = await auth.use("api").attempt(data.email, data.password);
      return { message: "Login successfully", data: token };
    } catch {
      return response.unauthorized("Invalid credentials");
    }
  }

  public async forgotPassword({ request, response }) {
    const data = await request.validate(EmailValidator);
    const user = await User.findBy("email", data.email);
    if (!user) {
      return response.notFound({ message: "User not found" });
    }

    await new ForgotPasswordMailer(user).send();
    return { message: "reset password email sent successfully" };
  }

  public async resetPassword({ request, response }) {
    if (!request.hasValidSignature()) {
      return response.unprocessableEntity({
        error: "Invalid reset password link.",
      });
    }
    const user = await User.findBy("email", request.param("email"));

    return {
      message: "reset password successfully",
      data: user,
    };
  }

  public async logout({ auth, response }) {
    await auth.use("api").revoke();
    return response.noContent();
  }
}
