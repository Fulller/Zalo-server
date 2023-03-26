import express from "express";
import messageControllers from "../controllers/message.js";
const route = express.Router();

route.post("/sendmessageV2", messageControllers.sendmessageV2);
route.get("/getmessageV2", messageControllers.getmessageV2);
route.delete(
  "/deletemessageonmyside",
  messageControllers.deletemessageonmyside
);
route.delete("/recallmessage", messageControllers.recallmessage);
route.put("/seenmessage", messageControllers.seenmessage);
route.put("/clearconversation", messageControllers.clearconversation);

export default route;
