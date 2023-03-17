import User from "../modules/Users.js";
import bcrypt from "bcrypt";
import Conversation from "../modules/Conversations.js";
import Message from "../modules/Messages.js";
import user from "../controllers/user.js";

const tools = {
  comparePassword: function (yourPassword, hashPassword) {
    return bcrypt.compare(yourPassword, hashPassword);
  },
  response: function () {
    this.result = {
      isSuccess: false,
      code: "000",
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
  register: function (param) {
    return new Promise(async (resole, reject) => {
      let response = new tools.response();
      try {
        let findUser = await User.findOne({ userName: param.userName });
        if (findUser) {
          response.result.code = "001";
        } else {
          if (param.userName.length >= 6 && param.password.length >= 6) {
            let user = await User.create({
              userName: param.userName,
              password: bcrypt.hashSync(param.password, 10),
              showName: param.showName,
              sex: param.sex,
              avatar:
                "https://images.assetsdelivery.com/compings_v2/koblizeek/koblizeek2001/koblizeek200100050.jpg",
              roomIds: [param.userName],
              messagesHistory: [],
            });
            response.result = {
              isSuccess: true,
              code: "002",
              data: {
                _id: user._id,
                avatar: user.avatar,
                createdAt: user.createdAt,
                roomIds: user.roomIds,
                showName: user.showName,
                userName: user.userName,
                updatedAt: user.updatedAt,
              },
            };
            response.status = 201;
          } else {
            response.result.code = "006";
          }
        }
        resole(response);
      } catch (e) {
        response.result.code = "000";
        reject(response);
      }
    });
  },
  login: function (param) {
    return new Promise(async (resole, reject) => {
      let response = new tools.response();
      try {
        let user = await User.findOne({ userName: param.userName });
        if (user) {
          if (await tools.comparePassword(param.password, user.password)) {
            response.result = {
              isSuccess: true,
              code: "003",
              data: {
                _id: user._id,
                avatar: user.avatar,
                createdAt: user.createdAt,
                roomIds: user.roomIds,
                showName: user.showName,
                userName: user.userName,
                updatedAt: user.updatedAt,
              },
            };
          } else {
            response.result.code = "004";
          }
        } else {
          response.result.code = "005";
        }
        resole(response);
      } catch {
        response.result.code = "000";
        reject(response);
      }
    });
  },
  wantobefriend: function (param) {
    return new Promise(async (resole, reject) => {
      let response = new tools.response();
      try {
        let user = await User.findOne({ userName: param.userName });
        let userFriend = await User.findOne({ userName: param.userNameFriend });
        if (param.userName == param.userNameFriend) {
          response.result.code = "008";
          resole(response);
        }
        if (
          user &&
          userFriend &&
          user?.friends.every((friend) => {
            return friend != param.userNameFriend;
          }) &&
          user?.wanttobeFriends.every((friend) => {
            return friend != param.userNameFriend;
          })
        ) {
          user.wanttobeFriends.push(param.userNameFriend);
          userFriend.requesFriends.push(param.userName);
          user.save();
          userFriend.save();
          response.result = {
            isSuccess: true,
            code: "007",
            data: user.wanttobeFriends,
          };
        } else {
          response.result.code = "008";
        }
        resole(response);
      } catch {
        response.result.code = "000";
        reject(response);
      }
    });
  },
  addfriend: function (param) {
    return new Promise(async (resole, reject) => {
      let response = new tools.response();
      try {
        let user = await User.findOne({ userName: param.userName });
        let userFriend = await User.findOne({ userName: param.userNameFriend });
        if (param.userName == param.userNameFriend) {
          response.result.code = "010";
          resole(response);
        }
        if (
          user &&
          userFriend &&
          user?.friends.every((friend) => {
            return friend != param.userNameFriend;
          })
        ) {
          await Conversation.create({
            conversationId: tools.mergeUserName(
              user.userName,
              userFriend.userName
            ),
            members: [user.userName, userFriend.userName],
          });
          user.friends.push(param.userNameFriend);
          userFriend.friends.push(param.userName);
          user.requesFriends = user.requesFriends.filter((friend) => {
            return friend != param.userNameFriend;
          });
          userFriend.wanttobeFriends = user.wanttobeFriends.filter((friend) => {
            return friend != param.userName;
          });
          user.save();
          userFriend.save();
          response.result = {
            isSuccess: true,
            code: "009",
            data: user.friends,
          };
        } else {
          response.result.code = "010";
        }
        resole(response);
      } catch {
        response.result.code = "000";
        reject(response);
      }
    });
  },
  unfriend: function (param) {
    return new Promise(async (resole, reject) => {
      let response = new tools.response();
      try {
        let user = await User.findOne({ userName: param.userName });
        let userFriend = await User.findOne({ userName: param.userNameFriend });
        if (param.userName == param.userNameFriend) {
          response.result.code = "0012";
          resole(response);
        }
        if (
          user &&
          userFriend &&
          user?.friends.some((friend) => {
            return friend == param.userNameFriend;
          })
        ) {
          user.friends = user.friends.filter((friend) => {
            return friend != param.userNameFriend;
          });
          user.messagesHistory = user.messagesHistory.filter(
            (conversationId) => {
              return (
                conversationId !=
                tools.mergeUserName(user.userName, userFriend.userName)
              );
            }
          );
          userFriend.friends = userFriend.friends.filter((friend) => {
            return friend != param.userName;
          });
          userFriend.messagesHistory = userFriend.messagesHistory.fill(
            (conversationId) => {
              return (
                conversationId !=
                tools.mergeUserName(user.userName, userFriend.userName)
              );
            }
          );
          Conversation.remove({
            conversationId: tools.mergeUserName(
              user.userName,
              userFriend.userName
            ),
          }).exec();

          response.result = {
            isSuccess: true,
            code: "011",
            data: user.friends,
          };
          user.save();
          userFriend.save();
        } else {
          response.result.code = "012";
        }
        resole(response);
      } catch {
        response.result.code = "000";
        reject(response);
      }
    });
  },
  gettypefriends: function (param) {
    return new Promise(async (resole, reject) => {
      let response = new tools.response();
      try {
        let user = await User.findOne({ userName: param.userName });
        let inforusers = await Promise.all(
          user[param.type || "friends"].map(async (userName) => {
            let dataUser = await User.findOne({ userName: userName });
            return {
              id: dataUser._id,
              userName: dataUser.userName,
              showName: dataUser.showName,
              avatar: dataUser.avatar,
              isOnline: dataUser.isOnline,
              friends: dataUser.friends,
              groups: dataUser.groups,
            };
          })
        );
        if (inforusers) {
          response.result = {
            isSuccess: true,
            code: "013",
            type: param.type || "friends",
            data: inforusers,
          };
        } else {
          response.result.code = "005";
        }
        resole(response);
      } catch {
        response.result.code = "000";
        reject(response);
      }
    });
  },
  getinfouser: function (param) {
    return new Promise(async (resole, reject) => {
      let response = new tools.response();
      try {
        let user = await User.findOne({ userName: param.userName });
        if (user) {
          user.password = null;
          response.result = {
            isSuccess: true,
            code: "014",
            data: user,
          };
        } else {
          response.result.code = "015";
        }
        resole(response);
      } catch {
        response.result.code = "000";
        reject(response);
      }
    });
  },
  sendmessage: function (param) {
    return new Promise(async (resole, reject) => {
      let response = new tools.response();
      try {
        let conversation = await Conversation.findOne({
          conversationId: param.conversationId,
        });
        if (conversation) {
          let message = new Message({
            content: param.content,
            sender: param.sender,
            type: param.type,
          });
          conversation.messages.push(message);
          conversation.save();
          response.result = {
            isSuccess: true,
            code: "016",
            data: message,
          };
        } else {
          response.result.code = "017";
        }
        resole(response);
      } catch {
        response.result.code = "000";
        reject(response);
      }
    });
  },
  getconversation: function (param) {
    return new Promise(async (resole, reject) => {
      let response = new tools.response();
      try {
        let conversation = await Conversation.findOne({
          conversationId: param.conversationId,
        });
        if (conversation) {
          response.result = {
            isSuccess: true,
            code: "018",
            data: conversation,
          };
        } else {
          response.result.code = "019";
        }
        resole(response);
      } catch {
        response.result.code = "000";
        reject(response);
      }
    });
  },
  findfriend: function (param) {
    return new Promise(async (resole, reject) => {
      let response = new tools.response();
      try {
        let userFriend = await User.findOne({ userName: param.userNameFriend });
        if (userFriend) {
          response.result = {
            code: "020",
            isSuccess: true,
            data: {
              userName: userFriend.userName,
              showName: userFriend.showName,
              avatar: userFriend.avatar,
            },
          };
        } else {
          response.result.code = "021";
        }
        resole(response);
      } catch {
        response.result.code = "000";
        reject(response);
      }
    });
  },
  updatamessageshistoryError: function (param) {
    return new Promise(async (resole, reject) => {
      let response = new tools.response();
      try {
        let user = await User.findOne({ userName: param.userName });
        if (user) {
          if (user.messagesHistory) {
            user.messagesHistory = user.messagesHistory.filter((mh) => {
              return mh != param.conversationId;
            });
            user.messagesHistory.unshift(param.conversationId);
          } else {
            user.messagesHistory = [param.conversationId];
          }
          response.result = {
            isSuccess: true,
            code: "022",
            data: user.messagesHistory,
          };
          user.save();
        } else {
          response.result.code = "023";
        }
        resole(response);
      } catch {
        response.result.code = "000";
        reject(response);
      }
    });
  },
  getoptional: function (param) {
    return new Promise(async (resole, reject) => {
      let response = new tools.response();
      try {
        let user = await User.findOne({ userName: param.userName });
        if (user && user[param.optional]) {
          response.result = {
            isSuccess: true,
            code: "024",
            data: user[param.optional] || null,
          };
        } else {
          response.result.code = "025";
        }
        resole(response);
      } catch {
        response.result.code = "000";
        reject(response);
      }
    });
  },
  updatamessageshistory: function (param) {
    return new Promise(async (resole, reject) => {
      let response = new tools.response();
      try {
        let user = await User.findOne({ userName: param.userName });
        if (user) {
          let messagesHistory = user.messagesHistory.filter((mh) => {
            return mh != param.conversationId;
          });
          messagesHistory.unshift(param.conversationId);
          await User.updateOne(
            { userName: param.userName },
            { messagesHistory: messagesHistory }
          );
          response.result = {
            isSuccess: true,
            code: "022",
            data: messagesHistory,
          };
        } else {
          response.result.code = "023";
        }
        resole(response);
      } catch {
        response.result.code = "000";
        reject(response);
      }
    });
  },
  updateinfouser: function (param) {
    return new Promise(async (resole, reject) => {
      let response = new tools.response();
      try {
        let user = await User.findOne({ userName: param.userName });
        if (user) {
          if (!!param?.avatar) {
            user.avatar = param.avatar;
          }
          if (!!param?.showName) {
            user.showName = param.showName;
          }
          user.save();
          response.result = {
            isSuccess: true,
            code: "026",
          };
        } else {
          response.result.code = "027";
        }
        resole(response);
      } catch {
        response.result.code = "000";
        reject(response);
      }
    });
  },
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
            code: "028",
          };
        } else {
          response.result.code = "029";
        }
        resole(response);
      } catch {
        response.result.code = "000";
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
            code: "030",
          };
        } else {
          response.result.code = "031";
        }
        resole(response);
      } catch {
        response.result.code = "000";
        reject(response);
      }
    });
  },
};

//000 Đã có lỗi sảy ra
//001 Tài khoản đã tồn tại
//002 Đăng ký tài khoản thành công
//003 Đăng nhập thành công
//004 Mật khẩu sai
//005 Tài khoản không tồn tại
//006 Tên đăng nhập hoặc mật khẩu ít hơn 6 ký tự
//007 Đã gửi yếu cầu kết bạn thành công
//008 Không thể gửi yêu cầu kết bạn do đã là bạn hoặc không tìm thấy người dùng
//009 Kết bạn thành công
//010 Không tìm thấy người dùng hoặc đã là bạn
//011 Xóa bạn thành công
//012 Không tìm thấy người dùng hoặc đã xóa bạn
//013 Trả về danh sách thành công
//014 Lấy thông tin người dùng thành công
//015 Lấy thông tin người dùng thất bại
//016 Gửi tin nhắn thành công
//017 Gửi tin nhắn thất bại do chưa có cuộc hội thoại
//018 Lấy thông tin cuộc trò truyền thành công
//019 Lây thông tin cuộc trò truyện thất bại
//020 Tìm bạn thành công
//021 Không tìm thấy người dùng
//022 Cập nhật messages history thàng công
//023 Cập nhật messages history thất bại
//024 Lấy dữ liệu theo tùy chọn thành công
//025 Lấy dữ liệu theo tùy chọn không thành công
//026 Cập nhật thông tin người dùng thành công
//027 Cập nhật thông tin người dùng thất bại
//028 Gửi tin nhắn thành công
//029 Gửi tin nhắn thất bại
