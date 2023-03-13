import userAPI from "./user.js";
import imageAPI from "./image.js";

export default function (app) {
  app.use("/api/user", userAPI);
  app.use("/api/image", imageAPI);
}
