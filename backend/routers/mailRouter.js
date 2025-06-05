import express from "express";
import dotenv from "dotenv";
import { User, Summaries, Mail } from "../schema.js";
import getEmailInfo from "../utils/getEmailInfo.js";
import getUserEmails from "../utils/getUserEmails.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import { getUnsummarizedMails } from "../utils/getUnsummarized.js";
import { processAndUpdateMail } from "../utils/processAndUpdate.js";

const mailRouter = express.Router();
dotenv.config();
mailRouter.get("/list", async (req, res) => {
  try {
    const access_token = await generateAccessToken(req.user.refresh_token);
    console.log("ACCESS TOKEN IN MAILROUTER", access_token);

    const data = await getUserEmails(access_token);

    const updatedUser = await User.findOneAndUpdate(
      { email: req.user.email },
      { $set: { mail_list: data } },
      { new: true }
    );

    const userId = updatedUser._id;

    const messageIds = data.messages.map((mail) => mail.id);

    // Step 1: Get messageIds that already exist
    const existingMails = await Mail.find({
      userId,
      messageId: { $in: messageIds },
    }).select("messageId");

    const existingIds = new Set(existingMails.map((m) => m.messageId));

    // Step 2: Filter out already existing mails
    const newMailDocs = data.messages
      .filter((mail) => !existingIds.has(mail.id))
      .map((mail) => {
        const headers = mail.payload?.headers || [];
        const fromHeader = headers.find((h) => h.name.toLowerCase() === "from");
        const sender = fromHeader?.value || "Unknown Sender";

        return {
          userId,
          messageId: mail.id,
          threadId: mail.threadId,
          mailText: "",
          sender,
          summarized: false,
        };
      });

    if (newMailDocs.length > 0) {
      await Mail.insertMany(newMailDocs, { ordered: false });
    }

    res.status(200).json({
      inserted: newMailDocs.length,
      skipped: data.messages.length - newMailDocs.length,
    });
  } catch (err) {
    console.error("Error in /list:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// mailRouter.get("/data/:messId", async (req, res) => {
//   try {
//     const messageId = req.params.messId;
//     const threadId = "RANDOM";
//     const access_token = await generateAccessToken(req.user.refresh_token);
//     const data = await getEmailInfo(messageId, access_token);
//     console.log(data);
//     const headers = data.headers || [];

//     const fromHeader = headers.find((h) => h.name.toLowerCase() === "from");
//     const sender = fromHeader?.value || "Unknown Sender";
//     const partsArr = data.parts;
//     let bodyText = "";
//     partsArr.forEach((element) => {
//       if (element.mimeType === "text/plain") {
//         bodyText += element.body.data;
//       }
//     });
//     const formData = new URLSearchParams();
//     formData.append("email_text", bodyText);
//     const spamRes = await fetch(process.env.SPAM_MODEL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: formData.toString(),
//     });
//     const spamJSON = await spamRes.json();
//     let isSpam = false;
//     if (spamJSON.prediction == "Spam") {
//       isSpam = true;
//     }
//     console.log("SPAM IS", isSpam);
//     const updatedMail = await Mail.findOneAndUpdate(
//       { messageId, userId: req.user._id },
//       {
//         mailText: bodyText,
//         isSpam,
//         summarized: false,
//         addedAt: new Date(),
//         sender: senderName,
//       },
//       { new: true, upsert: false } // do not create new if not found
//     );

//     if (!updatedMail) {
//       return res.status(404).json({ error: "Mail not found to update" });
//     } else {
//       res.json({ bodyText: bodyText });
//     }
//   } catch (e) {
//     console.log("ERROR IN MAILROUTER", e);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

mailRouter.get("/summarize", async (req, res) => {
  try {
    const mailArray = await getUnsummarizedMails(req.user._id);
    console.log(mailArray);
    const results = await Promise.all(
      mailArray.map((mail) => processAndUpdateMail(req, mail.messageId))
    );
    res.json({ results: results });
  } catch (e) {
    console.log(e);
  }
});

export default mailRouter;
