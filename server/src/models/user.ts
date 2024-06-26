import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
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
    default: "Student",
    enum: ["Student", "Teacher", "Admin"],
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
