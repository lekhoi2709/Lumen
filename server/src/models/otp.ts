import mongoose from "mongoose";
import mailSender from "../utils/mail-sender";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
    expires: 300, // 5 minutes,
  },
});

async function sendVerificationEmail(email: string, otp: string) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification",
      `<h1>Please confirm your OTP</h1>
      <p>Your verification code is: <strong>${otp}</strong></p>
      <p>Please complete the verification process in 5 minutes.</p>
      Lumen`
    );
    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

otpSchema.pre("save", async function (next) {
  console.log("New document saved to the database");
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
