import express from "express";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import connectDb from "./mongoDbconfig.js";
import { User, Summaries } from "./schema.js";

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
function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.user;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

app.use("/private", authMiddleware);

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

    await User.create({
      email: userDetails.email,
      first_name: userDetails.given_name,
      last_name: userDetails.family_name,
      picture: userDetails.picture,
      refresh_token: user.refresh_token,
    });

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

// app.get("/private/api/user-data", async (req, res) => {
//   const user = req.user;
//   console.log("user is", user);
//   res.json(user);
// });

// app.get("/private/api/mail-list", async (req, res) => {
//   const {email, first_name, last_name, picture} = req.user;

//   const data = await getUserEmails(access_token);
//   res.json(data);
// });

app.listen(port, () => {
  console.log("Server Started...");
});
