import { Mail } from "../schema.js";
import getEmailInfo from "../utils/getEmailInfo.js";
import generateAccessToken from "../utils/generateAccessToken.js";

export async function processAndUpdateMail(req, messageId) {
  try {
    const access_token = await generateAccessToken(req.user.refresh_token);
    const data = await getEmailInfo(messageId, access_token);

    const headers = data.headers || [];
    const fromHeader = headers.find((h) => h.name.toLowerCase() === "from");
    const sender = fromHeader?.value || "Unknown Sender";

    const partsArr = data.parts || [];
    let bodyText = "";

    partsArr.forEach((element) => {
      if (element.mimeType === "text/plain" && element.body?.data) {
        bodyText += element.body.data;
      }
    });

    // Send to spam detection model
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
    const isSpam = spamJSON.prediction === "Spam";

    const updatedMail = await Mail.findOneAndUpdate(
      { messageId, userId: req.user._id },
      {
        mailText: bodyText,
        isSpam,
        summarized: false,
        addedAt: new Date(),
        sender,
      },
      { new: true, upsert: false }
    );

    if (!updatedMail) {
      throw new Error("Mail not found to update");
    }

    return { bodyText, isSpam, sender };
  } catch (err) {
    console.error("processAndUpdateMail error:", err);
    throw err;
  }
}
