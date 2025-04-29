import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true },
    email: String,
    userName: String,
    correct: { type: Number, default: 0 },
    incorrect: { type: Number, default: 0 },
    friends: { type: [String], default: [] },
    cities: { type: [String], default: [] },
    currentCityId: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
