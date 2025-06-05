import { Mail } from "../schema.js"; // adjust the path as needed

export async function getUnsummarizedMails(userId) {
  try {
    const mails = await Mail.find({ userId: userId, summarized: false })
      .sort({ addedAt: -1 }) // sort by latest
      .limit(10);

    return mails;
  } catch (error) {
    console.error("Error fetching latest unsummarized mails:", error);
    throw error;
  }
}
