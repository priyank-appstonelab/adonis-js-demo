/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.resource("/", "WebsController");

Route.group(() => {
  Route.post("/login", "AuthController.login");
  Route.post("/register", "AuthController.register");
  Route.post("/forgot-password", "AuthController.forgotPassword");
  Route.get("/reset-password/:email", "AuthController.resetPassword").as(
    "resetPassword"
  );

  Route.group(() => {
    Route.get("/me", "AuthController.me");
    Route.post("/logout", "AuthController.logout");
  }).middleware("auth:api");
}).prefix("/auth");

Route.group(() => {
  Route.get("/user/notifications", "UsersController.notifications");
  Route.resource("/user", "UsersController").apiOnly();

  Route.resource("/address", "AddressesController").only(["store", "destroy"]);
  Route.resource("/posts", "PostsController");
}).middleware("auth:api");
// Route.on("*").redirect("/");

Route.group(() => {
  Route.post("login", "Admin/ProfilesController.login").as(
    "admin.profile.login"
  );
}).prefix("admin/auth");

Route.group(() => {
  Route.get("me", "Admin/ProfilesController.show").as("admin.profile");
  Route.get("logout", "Admin/ProfilesController.logout").as(
    "admin.profile.logout"
  );
  Route.patch("refresh", "Admin/ProfilesController.refresh").as(
    "admin.profile.refresh"
  );
  Route.patch("update", "Admin/ProfilesController.updateProfile").as(
    "admin.profile.update"
  );
})
  .prefix("admin/auth")
  .middleware(["auth:api", "is:administrator"]);

Route.group(() => {
  Route.resource("users", "Admin/UsersController");
})
  .prefix("admin")
  .middleware(["auth:api", "is:administrator"])
  .middleware("can:user.users.index");
