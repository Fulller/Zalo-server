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
route.put("/updatamessageshistory", userControllers.updatamessageshistory);
route.get("/getoptional", userControllers.getoptional);
route.put("/updateinfouser", userControllers.updateinfouser);
//
route.post("/sendmessageV2", userControllers.sendmessageV2);
route.get("/getmessageV2", userControllers.getmessageV2);
route.delete("/deletemessageonmyside", userControllers.deletemessageonmyside);
route.delete("/recallmessage", userControllers.recallmessage);
route.put("/seenmessage", userControllers.seenmessage);
route.put("/clearconversation", userControllers.clearconversation);

export default route;
