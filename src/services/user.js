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
            function removeVietnameseTones(str) {
              str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
              str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
              str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
              str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
              str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
              str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
              str = str.replace(/đ/g, "d");
              str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
              str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
              str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
              str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
              str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
              str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
              str = str.replace(/Đ/g, "D");
              str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
              str = str.replace(/ + /g, " ");
              str = str.trim();
              str = str.replace(
                /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
                " "
              );
              return str;
            }
            let avatarMap = {
              a: "6414bd62469830dcbd05a4e1",
              b: "6414bd75a01e923c710ae424",
              c: "6414bd88deac215843789e75",
              d: "6414bd99123027ce3ad01f97",
              e: "6414bdb08d34605cec69dcba",
              f: "6414bdcfb0f89b29fa8d8795",
              g: "6414bdf1f68ce38b30758026",
              h: "6414be17eb1df4028043065f",
              i: "6414be3a4004b8966769c948",
              j: "6414be4eeb6e0a3c769cbce8",
              k: "6414be7682ae9ff57cb75dc3",
              l: "6414be9ee73e851940cfd871",
              m: "6414beb56ae0a43f6e8ebd98",
              n: "6414bec95802d417ea14643f",
              o: "6414beeecbe19c65e28c78bd",
              p: "6414bf10621b48f800b9f595",
              q: "6414bf2153499fad7eb7d22f",
              r: "6414bf3feb418ce2ff994ca7",
              s: "6414bf5737d03c21bfbb4768",
              t: "6414bf6faf74b641cdab7e4c",
              u: "6414bf80fc38a57954616a68",
              v: "6414bfc7cc17027952286106",
              w: "6414bfb6e04e8e3c0dd34d7e",
              x: "6414bfd6965f242b3a45d3b0",
              y: "6414bfe3965f242b3a45d3b2",
              z: "6414bff1afd330e7d2f801d1",
            };
            let user = await User.create({
              userName: param.userName,
              password: bcrypt.hashSync(param.password, 10),
              showName: param.showName,
              sex: param.sex,
              avatar:
                avatarMap[
                  removeVietnameseTones(param.showName[0].toLowerCase())
                ],
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
              background: dataUser.background,
              sex: dataUser.sex,
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
          if (!!param?.background) {
            user.background = param.background;
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
            code: "032",
            data: message,
          };
        } else {
          response.result.code = "033";
        }
        resole(response);
      } catch {
        response.result.code = "000";
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
            code: "034",
            data: message,
          };
        } else {
          response.result.code = "035";
        }
        resole(response);
      } catch {
        response.result.code = "000";
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
          message.save;
          response.result = {
            isSuccess: true,
            code: "036",
            data: message,
          };
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
//030 Lấy tin nhắn thành công
//031 lấy tin nhắn thất bại
//032 Xóa tin nhắn thành công
//033 Xóa tin nhắn thất bại
//034 Thu hồi tin nhắn thành công
//035 Thu hồi tin nhắn không thành công
//036 Đã xem tin nhắn
//037 Xem tin nhắn thất bại
