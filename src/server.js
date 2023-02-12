import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieSession from "cookie-session";

import dbConnect from "./configs/db.js";
import routeConfig from "./routes/index.js";
// import authRoute from "./routes/auth.js";
// import passport from "passport";
// import "./config/passport.js";

const app = express();
const PORT = process.env.PORT || 3001;

dotenv.config();
dbConnect();
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cookieSession({
    name: "session",
    keys: ["copper"],
    maxAge: 24 * 60 * 60 * 100,
  })
);
app.use(
  cors({
    origin: true,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());
routeConfig(app);

// app.use(passport.initialize());
// app.use(passport.session());

app.listen(PORT, () => {
  console.log("Server is runing on PORT " + PORT);
});
