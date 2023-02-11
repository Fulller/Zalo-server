import express from "express";
import userControllers from "../controllers/user.js";
const route = express.Router();

route.post("/register", userControllers.register);
route.get("/login", userControllers.login);

export default route;
