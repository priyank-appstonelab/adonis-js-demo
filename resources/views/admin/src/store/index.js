/**
 * This would be the home of our stores.
 */
import { global } from "./global/store";
import { user } from "./user/store";
// Add new store. Don't remove this line

export default {
  modules: {
    global,
    user,
    // export new store. Don't remove this line
  },
};
