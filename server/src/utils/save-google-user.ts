import jwt from "jsonwebtoken";
import User from "../models/user";

const saveUser = async (payload: any) => {
  const { email, given_name, family_name, sub, picture } = payload;
  const user = await User.findOne({ email: email });

  const accessToken = jwt.sign(
    {
      email: email,
      role: "Student",
      avatarUrl: picture,
      firstName: given_name,
      lastName: family_name,
    },
    process.env.JWT_SECRET || "",
    {
      expiresIn: "2h",
    }
  );

  if (!user) {
    const newUser = new User({
      email: email,
      firstName: given_name,
      lastName: family_name,
      avatarUrl: picture,
      authProvider: "google",
      providerId: sub,
      accessToken: accessToken,
    });

    await newUser.save();
    return;
  }

  if (user && user.authProvider !== "google") {
    user.authProvider = "google";
    user.providerId = sub;
    user.accessToken = accessToken;

    await user.save();
    return;
  }

  user.accessToken = accessToken;
  await user.save();
  return accessToken;
};

export default saveUser;
