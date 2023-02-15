import User from "../modules/Users.js";
import bcrypt from "bcrypt";

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
            let data = await User.create({
              userName: param.userName,
              password: bcrypt.hashSync(param.password, 10),
              showName: param.showName,
              sex: param.sex,
              avatar:
                "https://images.assetsdelivery.com/compings_v2/koblizeek/koblizeek2001/koblizeek200100050.jpg",
              roomIds: [param.userName],
            });
            response.result = {
              isSuccess: true,
              code: "002",
              data: data,
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
              data: user,
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
        if (
          user &&
          userFriend &&
          user?.friends.every((friend) => {
            return friend != param.userNameFriend;
          })
        ) {
          user.friends.push(param.userNameFriend);
          user.requesFriends = user.requesFriends.filter((friend) => {
            return friend != param.userNameFriend;
          });
          userFriend.friends.push(param.userName);
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
          userFriend.friends = userFriend.friends.filter((friend) => {
            return friend != param.userName;
          });
          user.save();
          userFriend.save();
          response.result = {
            isSuccess: true,
            code: "011",
            data: user.friends,
          };
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
        resole.result.code = "000";
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
