import { OAuth2Client } from "google-auth-library";
import { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";

const saveUser = async (payload: any, tokens: any) => {
  const { email, given_name, family_name, sub, picture } = payload;
  const user = await User.findOne({ email: email });

  if (!user) {
    const newUser = new User({
      email: email,
      firstName: given_name,
      lastName: family_name,
      avatarUrl: picture,
      authProvider: "google",
      providerId: sub,
      accessToken: tokens.access_token,
    });

    await newUser.save();
    return;
  }

  if (user && user.authProvider !== "google") {
    user.authProvider = "google";
    user.providerId = sub;
    user.accessToken = tokens.access_token;

    await user.save();
    return;
  }

  user.accessToken = tokens.access_token;
  await user.save();
};

export default {
  googleAuth: async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Referrer-Policy", "no-referrer-when-downgrade");
    const redirectURL = process.env.REDIRECT_URL;

    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectURL
    );

    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: "https://www.googleapis.com/auth/userinfo.profile email openid ",
      prompt: "consent",
    });

    res.json({ url: authorizeUrl });
  },

  googleCallback: async (req: Request, res: Response) => {
    const code = req.query.code as string;
    try {
      const redirectURL = process.env.REDIRECT_URL;

      const oAuth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        redirectURL
      );

      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);

      const ticket = await oAuth2Client.verifyIdToken({
        idToken: tokens.id_token as string,
        audience: process.env.CLIENT_ID,
      });

      const payload = ticket.getPayload();
      await saveUser(payload, tokens);

      const refreshToken = jwt.sign(
        {
          email: payload!.email,
          provider: "google",
        },
        process.env.JWT_REFRESH_SECRET || "",
        {
          expiresIn: "7d",
        }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.redirect(303, `${process.env.CLIENT_URL}/dashboard`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
