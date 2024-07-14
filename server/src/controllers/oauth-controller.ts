import { OAuth2Client } from "google-auth-library";
import { Request, Response } from "express";
import saveUser from "../utils/save-google-user";
import jwt from "jsonwebtoken";

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
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { accessToken, role } = await saveUser(payload);

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

      (req.session as any).userData = {
        user: {
          email: payload!.email,
          role: role,
          avatarUrl: payload!.picture,
          firstName: payload!.given_name,
          lastName: payload!.family_name,
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
      };

      return res.redirect(303, `${process.env.CLIENT_URL}/oauth/success`);
    } catch (error) {
      console.error(error);
      return res.redirect(303, `${process.env.CLIENT_URL}/login`);
    }
  },

  googleSuccess: async (req: Request, res: Response) => {
    const userData = (req.session as any).userData;

    if (!userData) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: userData.user,
      token: userData.accessToken,
      refreshToken: userData.refreshToken,
    });
  },
};
