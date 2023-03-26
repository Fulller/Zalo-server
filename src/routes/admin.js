import express from "express";
import adminControllers from "../controllers/admin.js";
const route = express.Router();

route.delete("/deleteimageisrecall", adminControllers.deleteimageisrecall);

export default route;
