import userAPI from "./user.js";

export default function (app) {
  app.use("/api/user", userAPI);
}
