import userAPI from "./user.js";
import imageAPI from "./image.js";
import messageAPI from "./message.js";
import adminAPI from "./admin.js";

export default function (app) {
  app.use("/api/user", userAPI);
  app.use("/api/image", imageAPI);
  app.use("/api/message", messageAPI);
  app.use("/api/admin", adminAPI);
}
