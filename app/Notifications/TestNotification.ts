import { NotificationContract } from "@ioc:Verful/Notification";
import User from "App/Models/User";

export default class TestNotification implements NotificationContract {
  public via() {
    return "database" as const;
  }

  public toDatabase(notifiable: User) {
    return {
      title: `Hello, ${notifiable.email}, this is a test notification`,
    };
  }
}
