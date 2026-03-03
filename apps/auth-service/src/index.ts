import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import passport from "./middleware/passport.middleware";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(passport.initialize());

app.listen(process.env.PORT, () => {
  console.log(`server runing on port ${process.env.PORT}`);
});
