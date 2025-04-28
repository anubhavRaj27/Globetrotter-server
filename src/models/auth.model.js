import mongoose from "mongoose";

const AuthSchema = new mongoose.Schema(
  {
    userId: String,
    email: { type: String, unique: true },
    passwordHash: String,
  },
  {
    timestamps: true,
  }
);

const Auth = mongoose.model("Auth", AuthSchema);
export default Auth;
