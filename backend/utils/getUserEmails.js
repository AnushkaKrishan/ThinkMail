import dotenv from "dotenv";
import { User, Summaries, Mail } from "../schema.js";
import getEmailInfo from "../utils/getEmailInfo.js";
import generateAccessToken from "../utils/generateAccessToken.js";

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

export default getUserEmails;
