import express from "express";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { User, Summaries, Mail } from "./schema.js";
import getUserData from "./utils/getUserData.js";

const authRouter = express.Router();
dotenv.config();

authRouter.get("/callback", async (req, res) => {
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

authRouter.post("/login", async (req, res, next) => {
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

export default authRouter;
