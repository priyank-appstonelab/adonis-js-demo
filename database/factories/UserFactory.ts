import User from "App/Models/User";
import Factory from "@ioc:Adonis/Lucid/Factory";
import AddressFactory from "./AddressFactory";

import { Attachment } from "@ioc:Adonis/Addons/AttachmentLite";
import Drive from "@ioc:Adonis/Core/Drive";
import { file } from "@ioc:Adonis/Core/Helpers";
export default Factory.define(User, async ({ faker }) => {
  const avatar = new Attachment({
    extname: "png",
    mimeType: "image/png",
    size: 10 * 1000,
    name: `${faker.string.alphanumeric(10)}.png`,
  });

  /**
   * Step 2: Mark image as persisted, this will disable the
   * functions of attachment lite that looks for multipart
   * body and attempts to write the file from the stream
   */
  avatar.isPersisted = true;

  /**
   * Step 3: Persist the file using Drive.
   */
  await Drive.put(avatar.name, (await file.generatePng("1mb")).contents);

  return {
    name: faker.internet.displayName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    avatar: avatar,
  };
})
  .relation("address", () => AddressFactory)
  .build();
