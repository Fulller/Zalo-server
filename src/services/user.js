import User from "../modules/Users.js";
import bcrypt from "bcrypt";

const tools = {
  comparePassword: function (yourPassword, hashPassword) {
    return bcrypt.compare(yourPassword, hashPassword);
  },
  response: function () {
    this.result = {
      isSuccess: false,
      message: "This is message",
    };
    this.status = 400;
  },
};

export default {
  register: function (param) {
    return new Promise(async (resole, reject) => {
      let response = new tools.response();
      try {
        let findUser = await User.findOne({ userName: param.userName });
        if (findUser) {
          response.result.message = "Account already exists";
        } else {
          await User.create({
            userName: param.userName,
            password: bcrypt.hashSync(param.password, 10),
            showName: param.showName,
            sex: param.sex,
            avatar: `https://zingmp3-fpci.onrender.com/images/defaultAvatar.jpg`,
            roomIds: [param.userName],
          });
          response.result = {
            isSuccess: true,
            message: "Create account success",
          };
          response.status = 201;
        }
        resole(response);
      } catch (e) {
        response.result.message = "Error";
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
              message: "Logged in successfully",
              data: user,
            };
            response.status = 200;
          } else {
            response.result.message = "Wrong password";
          }
        } else {
          response.result.message = "Account does not exist";
          response.status = 404;
        }
        resole(response);
      } catch {
        response.result.message = "Error";
        reject(response);
      }
    });
  },
};
