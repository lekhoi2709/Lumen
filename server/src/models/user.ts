import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  avatarUrl: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "user",
  },
  authProvider: {
    type: String,
    required: true,
    default: "local",
  },
  providerId: {
    type: String,
  },
  accessToken: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
