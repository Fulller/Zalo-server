import imageServices from "../services/image.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
import path, { dirname } from "path";
import { constants } from "buffer";
const __dirname = dirname(__filename);
import { Buffer } from "buffer";

export default {
  upload: async (req, res, next) => {
    const { result, status } = await imageServices.upload(req);
    return res.status(status).json(result);
  },
  get: async (req, res) => {
    const { result, status } = await imageServices.get(req.query);
    res.contentType("image/jpeg");
    res.send(result.data.data);
  },
};
