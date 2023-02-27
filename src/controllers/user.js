import userServices from "../services/user.js";

export default {
  register: async (req, res) => {
    const { result, status } = await userServices.register(req.body);
    return res.status(status).json(result);
  },
  login: async (req, res) => {
    const { result, status } = await userServices.login(req.query);
    return res.status(status).json(result);
  },
  wantobefriend: async (req, res) => {
    const { result, status } = await userServices.wantobefriend(req.body);
    return res.status(status).json(result);
  },
  addfriend: async (req, res) => {
    const { result, status } = await userServices.addfriend(req.body);
    return res.status(status).json(result);
  },
  unfriend: async (req, res) => {
    const { result, status } = await userServices.unfriend(req.body);
    return res.status(status).json(result);
  },
  gettypefriends: async (req, res) => {
    const { result, status } = await userServices.gettypefriends(req.query);
    return res.status(status).json(result);
  },
  getinfouser: async (req, res) => {
    const { result, status } = await userServices.getinfouser(req.query);
    return res.status(status).json(result);
  },
  sendmessage: async (req, res) => {
    const { result, status } = await userServices.sendmessage(req.body);
    return res.status(status).json(result);
  },
  getconversation: async (req, res) => {
    const { result, status } = await userServices.getconversation(req.query);
    return res.status(status).json(result);
  },
  findfriend: async (req, res) => {
    const { result, status } = await userServices.findfriend(req.query);
    return res.status(status).json(result);
  },
  updatamessageshistory: async (req, res) => {
    const { result, status } = await userServices.updatamessageshistory(
      req.body
    );
    return res.status(status).json(result);
  },
  getoptional: async (req, res) => {
    const { result, status } = await userServices.getoptional(req.query);
    return res.status(status).json(result);
  },
};
