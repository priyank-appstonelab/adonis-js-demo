import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class BasesController {
  static ctx: any;
  constructor(private ctx: HttpContextContract) {}

  public sendSuccess(data: { message: string }) {
    this.ctx.response.send(data);
  }
}
