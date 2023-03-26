import messageServices from "../services/message.js";

export default {
  sendmessageV2: async (req, res) => {
    const { result, status } = await messageServices.sendmessageV2(req.body);
    return res.status(status).json(result);
  },
  getmessageV2: async (req, res) => {
    const { result, status } = await messageServices.getmessageV2(req.query);
    return res.status(status).json(result);
  },
  deletemessageonmyside: async (req, res) => {
    const { result, status } = await messageServices.deletemessageonmyside(
      req.body
    );
    return res.status(status).json(result);
  },
  recallmessage: async (req, res) => {
    const { result, status } = await messageServices.recallmessage(req.body);
    return res.status(status).json(result);
  },
  seenmessage: async (req, res) => {
    const { result, status } = await messageServices.seenmessage(req.body);
    return res.status(status).json(result);
  },
  clearconversation: async (req, res) => {
    const { result, status } = await messageServices.clearconversation(
      req.body
    );
    return res.status(status).json(result);
  },
};
