import express from "express";
import dotenv from "dotenv";
import { User, Summaries, Mail } from "./schema.js";
import getEmailInfo from "./utils/getEmailInfo.js";
import generateAccessToken from "./utils/generateAccessToken.js";

const mailRouter = express.Router();
dotenv.config();

mailRouter.get("/list", async (req, res) => {
  const access_token = await generateAccessToken(req.user.refreshToken);
  console.log(access_token);
  const data = await getUserEmails(access_token);
  await User.findOneAndUpdate(
    { email: req.user.email },
    { $set: { mail_list: data } },
    { new: true }
  );
  res.json(data);s
});

mailRouter.get("/data", async (req, res) => {
  // const { messageId, threadId } = req.body;
  try {
    const messageId = "195e1ea76605afa2";
    const threadId = "RANDOM";
    const access_token = await generateAccessToken(req.user.refreshToken);
    const data = await getEmailInfo(messageId, access_token);
    const partsArr = data.parts;
    let bodyText = "";
    partsArr.forEach((element) => {
      if (element.mimeType === "text/plain") {
        bodyText += element.body.data;
      }
    });
    const formData = new URLSearchParams();
    formData.append("email_text", bodyText);
    const spamRes = await fetch(process.env.SPAM_MODEL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });
    const spamJSON = await spamRes.json();
    let isSpam = false;
    if (spamJSON.prediction == "Spam") {
      isSpam = true;
    }
    console.log("SPAM IS", isSpam);
    await Mail.create({
      messageId: messageId,
      threadId: threadId,
      mailText: bodyText,
      isSpam: isSpam,
    });
    res.json({ bodyText: bodyText });
  } catch (e) {
    console.log(e);
  }
});

export default mailRouter;
