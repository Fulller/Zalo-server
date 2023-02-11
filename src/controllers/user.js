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
};
