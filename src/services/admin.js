import User from "../modules/Users.js";
import bcrypt from "bcrypt";
import Conversation from "../modules/Conversations.js";
import Message from "../modules/Messages.js";
import Image from "../modules/Images.js";

const tools = {
  comparePassword: function (yourPassword, hashPassword) {
    return bcrypt.compare(yourPassword, hashPassword);
  },
  response: function (adminkey, resole) {
    this.result = {
      isSuccess: false,
      code: "000",
    };
    this.status = 200;
    //Check admin rights
    if (adminkey !== process.env.ADMINKEY) {
      this.result = {
        isSuccess: true,
        code: "301",
        data: "Without the right to be an administrator, add 'adminkey' to the request or wrong 'adminkey' !",
      };
      resole(this);
    }
  },
  mergeUserName: function (userName1, userName2) {
    if (userName1 < userName2) {
      return userName1 + userName2;
    } else {
      return userName2 + userName1;
    }
  },
};

export default {
  deleteimageisrecall: function (param) {
    return new Promise(async (resole, reject) => {
      let response = new tools.response(param.adminkey, resole);
      try {
        let messages = await Message.find({ isRecall: true, type: "image" });
        if (messages) {
          for (let message of messages) {
            await Image.deleteOne({ _id: message.content });
          }
          response.result = {
            isSuccess: true,
            code: "302",
            data: `There are ${messages.length} deleted photos`,
          };
        } else {
          response.result.code = "303";
        }
        resole(response);
      } catch {
        response.result.code = "300";
        reject(response);
      }
    });
  },
};

//300 Có lỗi xảy ra với admin
//301 Không có quyền admin, hãy thêm adminkey vào yêu cầu hoặc adminkey đã sai
//302 Xóa hình ảnh đã thu hồi thành công
//303 Xóa hình ảnh đã thu hồi thất bại
