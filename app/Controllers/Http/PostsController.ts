import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Helper from "App/Helpers";
import fetch from "node-fetch";
export default class PostsController {
  public async index({ response }: HttpContextContract) {
    const data = await fetch("https://jsonplaceholder.typicode.com/posts").then(
      (response) => response.json()
    );
    return response.send(
      Helper.sendSuccess("Retrieved Successfully", data, 200)
    );
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({ params, response }: HttpContextContract) {
    const data = await fetch(
      "https://jsonplaceholder.typicode.com/posts/" + params.id
    ).then((response) => response.json());
    return response.send(
      Helper.sendSuccess("Retrieved Successfully", data, 200)
    );
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
