import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import User from "App/Models/User";
import UserFactory from "Database/factories/UserFactory";

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await User.createMany([
      {
        name: "admin",
        email: "admin@demo.com",
        password: "secret",
      },
      {
        name: "user",
        email: "user@demo.com",
        password: "secret",
      },
    ]);
    await UserFactory.with("address", 2).createMany(10);
  }
}
