import jwt from "jsonwebtoken";
import User from "../models/user";

const saveUser = async (payload: any) => {
  const { email, given_name, family_name, sub, picture } = payload;
  const user = await User.findOne({ email: email });

  const accessToken = jwt.sign(
    {
      _id: user?._id,
      email: email,
      role: user?.role || "Student",
      avatarUrl: picture,
      firstName: given_name,
      lastName: family_name,
      courses: user?.courses,
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
    return { accessToken, role: "Student" };
  }

  if (user && user.authProvider !== "google") {
    user.firstName = given_name;
    user.lastName = family_name;
    user.authProvider = "google";
    user.providerId = sub;
    user.accessToken = accessToken;
    user.avatarUrl = picture;

    await user.save();
    return { accessToken, role: user.role };
  }

  user.accessToken = accessToken;
  await user.save();
  return { accessToken, role: user.role };
};

export default saveUser;
