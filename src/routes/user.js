import express from "express";
import userControllers from "../controllers/user.js";
const route = express.Router();

route.post("/register", userControllers.register);
route.get("/login", userControllers.login);
route.put("/wantobefriend", userControllers.wantobefriend);
route.put("/addfriend", userControllers.addfriend);
route.put("/unfriend", userControllers.unfriend);
route.get("/gettypefriends", userControllers.gettypefriends);

export default route;
