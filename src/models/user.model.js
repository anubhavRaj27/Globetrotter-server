import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true },
    userName: String,
    score: { type: Number, default: 0 },
    friends: { type: [String], default: [] },
    cities: { type: [String], default: [] },
    currentCityId: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
