import Route from "@ioc:Adonis/Core/Route";
import { BaseMailer, MessageContract } from "@ioc:Adonis/Addons/Mail";
import User from "App/Models/User";
import { API_URL } from "Config/app";

export default class ForgotPasswordMailer extends BaseMailer {
  constructor(private user: User) {
    super();
  }
  /**
   * WANT TO USE A DIFFERENT MAILER?
   *
   * Uncomment the following line of code to use a different
   * mailer and chain the ".options" method to pass custom
   * options to the send method
   */
  // public mailer = this.mail.use()

  /**
   * The prepare method is invoked automatically when you run
   * "ForgotPasswordMailer.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public prepare(message: MessageContract) {
    const link =
      API_URL +
      Route.makeSignedUrl(
        "resetPassword",
        {
          email: this.user.email,
        },
        {
          expiresIn: "30 min",
        }
      );
    const html = `<div><h2>Reset Password</h2>
    <p>Click below link to reset your password.</p>
    <p><a href="${link}">Reset password</a></p>
    <p>Thanks</p>
    </div>`;

    message
      .subject("Reset Password")
      .from("admin@example.com")
      .to(this.user.email)
      .html(html);
  }
}
