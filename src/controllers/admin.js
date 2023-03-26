import adminServices from "../services/admin.js";

export default {
  deleteimageisrecall: async (req, res) => {
    const { result, status } = await adminServices.deleteimageisrecall(
      req.body
    );
    return res.status(status).json(result);
  },
};
