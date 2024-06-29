import otpGenerator from "otp-generator";
import OTP from "../models/otp";
import User from "../models/user";
import { Request, Response } from "express";

export default {
  sendOTP: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const checkUserExisted = await User.findOne({ email });

      if (!checkUserExisted) {
        return res.status(404).json({ message: "User not found" });
      }

      let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
        digits: true,
      });

      let result = await OTP.findOne({ otp: otp });
      while (result) {
        otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
          digits: true,
        });
        result = await OTP.findOne({ otp: otp });
      }

      const otpPayload = { email, otp };
      const newOTP = await OTP.create(otpPayload);
      return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  verifyOTP: async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;

      const checkOTP = await OTP.find({ email })
        .sort({ createdAt: -1 })
        .limit(1);

      if (checkOTP.length === 0 || checkOTP[0].otp !== otp) {
        return res.status(404).json({ message: "OTP not found" });
      }

      return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
};
