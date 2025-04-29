import User from "../models/user.model.js";

export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing required userId" });
    }

    const user = await User.findOne({ userId }).lean();

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    console.error("getUser error:", err);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    let updates = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing required userId" });
    }
    if (updates.user && typeof updates.user === "object") {
      updates = updates.user;
    }

    delete updates._id;
    delete updates.userId;

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "No valid fields to update" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();
    console.log(updatedUser);
    if (!updatedUser) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    return res.json(updatedUser);
  } catch (err) {
    console.error("updateUser error:", err);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};
