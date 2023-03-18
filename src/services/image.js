import Image from "../modules/Images.js";
import fs from "fs";
import pathpublic from "../../public/index.js";

const tools = {
  response: function () {
    this.result = {
      isSuccess: false,
      code: "000",
    };
    this.status = 200;
  },
};

export default {
  upload: function (param) {
    return new Promise(async (resole, reject) => {
      let response = new tools.response();
      try {
        const anotherFile = new URL(param.file?.filename, import.meta.url);
        console.log({
          type1: pathpublic + "/images/" + param.file.filename,
          type2: anotherFile,
          type3: param.file,
        });
        const img = {
          // data: fs.readFileSync(
          //   "Y:/VSCodeWorkspace/FullStack/Zalo/server/" + param.file?.path
          // ),
          // data: fs.readFileSync(
          //   path
          //     .normalize(anotherFile?.href.split("src")[0] + param.file?.path)
          //     .replace("file:\\", "")
          // ),
          data: fs.readFileSync(pathpublic + "/images/" + param.file.filename),
          contentType: "image/png",
        };
        let dataImg = await Image.create(img);
        response.result = {
          isSuccess: true,
          code: "101",
          data: dataImg?._id,
        };
        resole(response);
      } catch {
        response.result.code = "000";
        reject(response);
      }
    });
  },
  get: function (param) {
    return new Promise(async (resole, reject) => {
      let response = new tools.response();
      try {
        let data = await Image.findById(param.id);
        if (data) {
          response.result = {
            isSuccess: true,
            code: "102",
            data: data,
          };
        } else {
          response.result.code = "103";
        }
        resole(response);
      } catch {
        response.result.code = "000";
        reject(response);
      }
    });
  },
};

// 101 upload ảnh thành công
// 102 lấy ảnh thành công
