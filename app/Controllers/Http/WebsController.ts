import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class WebsController {
  public async index({ view, request }: HttpContextContract) {
    const users = await User.query()
      .preload("address")
      .paginate(request.qs().page, 5);
    return view.render("welcome", { users: users });
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
