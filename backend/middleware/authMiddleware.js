import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User, Summaries, Mail } from "../schema.js";

dotenv.config();

async function findUser(given) {
  const user = await User.findOne({ email: given });
  return user;
}

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.user;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await findUser(decoded.email);
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export default authMiddleware;
