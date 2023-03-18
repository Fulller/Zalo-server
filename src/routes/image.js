import express from "express";
import imageController from "../controllers/image.js";
import multer from "multer";

const route = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_image");
  },
});
const upload = multer({ storage: storage });

route.post("/upload", upload.single("image"), imageController.upload);
route.get("/get", imageController.get);

export default route;
