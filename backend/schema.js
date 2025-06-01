import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  first_name: {
    type: String,
    require: false,
  },
  last_name: {
    type: String,
    require: false,
  },
  picture: {
    type: String,
    require: false,
  },
  refresh_token: {
    type: String,
    require: true,
  },
});

const summarySchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  summary_text: {
    type: String,
    required: true,
  },
  summary_date: {
    type: String,
    required: true,
  },
});

const mailSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
  },
  threadId: {
    type: String,
    required: true,
  },
  mailText: {
    type: String,
    required: true,
  },
  isSpam: {
    type: Boolean,
    required: false,
  },
});

const Mail = mongoose.models.Mail || mongoose.model("Mail", mailSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);
const Summaries =
  mongoose.models.Summaries || mongoose.model("Summaries", summarySchema);

export { User, Summaries, Mail };
