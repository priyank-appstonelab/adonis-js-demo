import Address from "App/Models/Address";
import Factory from "@ioc:Adonis/Lucid/Factory";

export default Factory.define(Address, ({ faker }) => {
  enum addressType {
    H = "H",
    O = "O",
  }
  return {
    addressLine1: faker.location.streetAddress(),
    addressLine2: faker.location.secondaryAddress(),
    addressType: faker.helpers.enumValue(addressType),
  };
}).build();
