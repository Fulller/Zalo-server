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
          response.result = {
            isSuccess: true,
            code: "014",
            data: {
              userName: user.userName,
              showName: user.showName,
              avatar: user.avatar,
              isOnline: user.isOnline,
              friends: user.friends,
              groups: user.groups,
            },
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
};

//000 ???? c?? l???i s???y ra
//001 T??i kho???n ???? t???n t???i
//002 ????ng k?? t??i kho???n th??nh c??ng
//003 ????ng nh???p th??nh c??ng
//004 M???t kh???u sai
//005 T??i kho???n kh??ng t???n t???i
//006 T??n ????ng nh???p ho???c m???t kh???u ??t h??n 6 k?? t???
//007 ???? g???i y???u c???u k???t b???n th??nh c??ng
//008 Kh??ng th??? g???i y??u c???u k???t b???n do ???? l?? b???n ho???c kh??ng t??m th???y ng?????i d??ng
//009 K???t b???n th??nh c??ng
//010 Kh??ng t??m th???y ng?????i d??ng ho???c ???? l?? b???n
//011 X??a b???n th??nh c??ng
//012 Kh??ng t??m th???y ng?????i d??ng ho???c ???? x??a b???n
//013 Tr??? v??? danh s??ch th??nh c??ng
//014 L???y th??ng tin ng?????i d??ng th??nh c??ng
//015 L???y th??ng tin ng?????i d??ng th???t b???i
//016 G???i tin nh???n th??nh c??ng
//017 G???i tin nh???n th???t b???i do ch??a c?? cu???c h???i tho???i
//018 L???y th??ng tin cu???c tr?? truy???n th??nh c??ng
//019 L??y th??ng tin cu???c tr?? truy???n th???t b???i
//020 T??m b???n th??nh c??ng
//021 Kh??ng t??m th???y ng?????i d??ng
//022 C???p nh???t messages history th??ng c??ng
//023 C???p nh???t messages history th???t b???i
//024 L???y d??? li???u theo t??y ch???n th??nh c??ng
//025 L???y d??? li???u theo t??y ch???n kh??ng th??nh c??ng
