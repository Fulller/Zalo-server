import User from "../modules/Users.js";
import bcrypt from "bcrypt";
import Conversation from "../modules/Conversations.js";
import Message from "../modules/Messages.js";

const tools = {
  comparePassword: function (yourPassword, hashPassword) {
    return bcrypt.compare(yourPassword, hashPassword);
  },
  response: function () {
    this.result = {
      isSuccess: false,
      code: "200",
    };
    this.status = 200;
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
  sendmessageV2: function (param) {
    return new Promise(async (resole, reject) => {
      let response = new tools.response();
      try {
        let message = await Message.create({
          conversationId: param.conversationId,
          content: param.content,
          sender: param.sender,
          type: param.type,
        });
        if (message) {
          response.result = {
            isSuccess: true,
            data: message,
            code: "201",
          };
        } else {
          response.result.code = "202";
        }
        resole(response);
      } catch {
        response.result.code = "200";
        reject(response);
      }
    });
  },
  getmessageV2: function (param) {
    return new Promise(async (resole, reject) => {
      let response = new tools.response();
      try {
        let messages = await Message.find({
          conversationId: param.conversationId,
        });
        if (messages) {
          response.result = {
            isSuccess: true,
            data: messages,
            code: "203",
          };
        } else {
          response.result.code = "204";
        }
        resole(response);
      } catch {
        response.result.code = "200";
        reject(response);
      }
    });
  },
  deletemessageonmyside: function (param) {
    return new Promise(async (resole, reject) => {
      let response = new tools.response();
      try {
        let message = await Message.findById(param.id);
        if (message && param.userName) {
          message.deleteBy = message.deleteBy.filter((userDelete) => {
            return userDelete != param.userName;
          });
          message.deleteBy.push(param.userName);
          message.save();
          response.result = {
            isSuccess: true,
            code: "205",
            data: message,
          };
        } else {
          response.result.code = "206";
        }
        resole(response);
      } catch {
        response.result.code = "200";
        reject(response);
      }
    });
  },
  recallmessage: function (param) {
    return new Promise(async (resole, reject) => {
      let response = new tools.response();
      try {
        let message = await Message.findById(param.id);
        if (message && param.userName == message.sender) {
          message.isRecall = true;
          message.save();
          response.result = {
            isSuccess: true,
            code: "207",
            data: message,
          };
        } else {
          response.result.code = "208";
        }
        resole(response);
      } catch {
        response.result.code = "200";
        reject(response);
      }
    });
  },
  seenmessage: function (param) {
    return new Promise(async (resole, reject) => {
      let response = new tools.response();
      try {
        let message = await Message.findById(param.id);
        if (message) {
          message.status = "seen";
          message.save();
          response.result = {
            isSuccess: true,
            code: "209",
            data: message,
          };
        } else {
          response.result.code = "210";
        }
        resole(response);
      } catch {
        response.result.code = "200";
        reject(response);
      }
    });
  },
  clearconversation: function (param) {
    return new Promise(async (resole, reject) => {
      let response = new tools.response();
      try {
        let { userName, conversationId } = param;
        let user = await User.findOne({ userName });
        let messsages = await Message.find({ conversationId });
        if (user && messsages) {
          response.result = {
            isSuccess: true,
            code: "211",
            data: { user, messsages },
          };
        } else {
          response.result.code = "212";
        }
        resole(response);
      } catch {
        response.result.code = "200";
        reject(response);
      }
    });
  },
};
//200 Có lỗi tin nhắn xảy ra
//201 Gửi tin nhắn thành công
//202 Gửi tin nhắn thất bại
//203 Lấy tin nhắn thành công
//204 lấy tin nhắn thất bại
//205 Xóa tin nhắn thành công
//206 Xóa tin nhắn thất bại
//207 Thu hồi tin nhắn thành công
//208 Thu hồi tin nhắn thất bại
//209 Cập nhật trạng thái đã xem tin nhắn thành công
//2010 Cập nhật trang thái đã xem tin nhắn thất bại
//211 Xóa cuộc hội thoại thành công
//212 Xóa cuộc hội thoại thất bại
