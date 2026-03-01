import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(helmet());
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`server runing on port ${process.env.PORT}`);
});
