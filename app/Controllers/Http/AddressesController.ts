import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Address from "App/Models/Address";
import User from "App/Models/User";
import CreateOrUpdateAddressValidator from "App/Validators/CreateOrUpdateAddressValidator";

export default class AddressesController {
  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(CreateOrUpdateAddressValidator);

    const user = await User.find(data.userId);
    if (!user) {
      return response.notFound({ message: "User not found" });
    }
    const address = await user.related("address").create(data);
    return response.send({
      message: "Address created successfully",
      data: address.serialize(),
    });
  }

  public async destroy({ request, response }: HttpContextContract) {
    const address = await Address.find(request.param("id"));
    if (!address) {
      return response.notFound({ message: "Address not found" });
    }
    address.delete();
    return response.send({
      message: "Address deleted successfully",
      data: address.serialize(),
    });
  }
}
