import express from "express";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import connectDb from "./mongoDbconfig.js";
import { User, Summaries, Mail } from "./schema.js";

const app = express();
dotenv.config();
const port = 3000;
///////////////
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

connectDb();
async function findUser(given) {
  const user = await User.findOne({ email: given });
  return user.refresh_token;
}

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.user;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.user.refreshToken = await findUser(req.user.email);
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

app.use("/private", authMiddleware);

async function generateAccessToken(refresh) {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
        client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: refresh,
      }),
    });
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error(error);
  }
}

async function getUserData(access_token) {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );
  const data = await response.json();
  return data;
}

async function getUserEmails(access_token) {
  const response = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  const data = await response.json();
  return data;
}

async function getEmailInfo(messageId, access_token) {
  const response = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
    { headers: { Authorization: `Bearer ${access_token}` } }
  );
  const data = await response.json();
  return data.payload;
}
/////////////////////////////////
app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const redirectURL = "http://localhost:3000/auth/callback";

    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      redirectURL
    );
    console.log("created oAuth2Client");
    const response = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(response.tokens);
    console.log("Tokens acquired");
    const user = oAuth2Client.credentials;
    console.log("credentials", user);
    const userDetails = await getUserData(user.access_token);

    const userJWT = jwt.sign(
      {
        email: userDetails.email,
        first_name: userDetails.given_name,
        last_name: userDetails.family_name,
        picture: userDetails.picture,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    let userDoc = await User.findOne({ email: userDetails.email });

    if (!userDoc) {
      await User.create({
        email: userDetails.email,
        first_name: userDetails.given_name,
        last_name: userDetails.family_name,
        picture: userDetails.picture,
        refresh_token: user.refresh_token,
      });
    } else {
      userDoc.refresh_token = user.refresh_token;
      await userDoc.save();
    }

    res.cookie("user", userJWT, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 3600000,
    });

    res.redirect(`http://localhost:5173/dashboard`);
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

app.post("/api/login", async (req, res, next) => {
  res.header("Referrer-Policy", "no-referrer-when-downgrade");

  const redirectURL = "http://localhost:3000/auth/callback";

  const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    redirectURL
  );

  const authorizeURL = oAuth2Client.generateAuthUrl({
    access_type: "offline", //🔴SET ONLY FOR TESTING!!!!
    scope: [
      "openid",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.readonly",
    ],
    prompt: "consent",
  });

  res.json({ URL: authorizeURL });
});

app.get("/private/api/mail-list", async (req, res) => {
  const access_token = await generateAccessToken(req.user.refreshToken);
  console.log(access_token);
  const data = await getUserEmails(access_token);
  res.json(data);
});

app.get("/private/api/mail-data", async (req, res) => {
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
    const spamRes = await fetch("https://thinkmail-4.onrender.com/predict", {
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

app.listen(port, () => {
  console.log("Server Started...");
});
