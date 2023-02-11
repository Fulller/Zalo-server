import mongoose from "mongoose";
async function connect() {
  try {
    await mongoose.connect(
      `mongodb+srv://ZaloUsername:${process.env.PASSWORDDB}@zaloclustuer.oog9zvq.mongodb.net/?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connect successfully <3");
  } catch (e) {
    console.log("Connect faile!!!");
  }
}
export default connect;
