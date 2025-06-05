import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./mongoDbconfig.js";
import authRouter from "./routers/authRouter.js";
import mailRouter from "./routers/mailRouter.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();
dotenv.config();
const port = 3000;

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/auth", authRouter);
app.use("/mail", authMiddleware, mailRouter);

connectDb();

app.listen(port, () => {
  console.log("Server Started...");
});
