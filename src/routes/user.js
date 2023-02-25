import express from "express";
import userControllers from "../controllers/user.js";
const route = express.Router();

route.post("/register", userControllers.register);
route.get("/login", userControllers.login);
route.put("/wanttobefriend", userControllers.wantobefriend);
route.put("/addfriend", userControllers.addfriend);
route.put("/unfriend", userControllers.unfriend);
route.get("/gettypefriends", userControllers.gettypefriends);
route.get("/getinfouser", userControllers.getinfouser);
route.post("/sendmessage", userControllers.sendmessage);
route.get("/getconversation", userControllers.getconversation);
route.get("/findfriend", userControllers.findfriend);

export default route;
