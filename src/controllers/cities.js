import Cities from "../models/cities.model.js";
import User from "../models/user.model.js";

export const getRandomCity = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findOne({ userId }).lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const [city] = await Cities.aggregate([
      { $match: { cityId: { $nin: user.cities } } },
      { $sample: { size: 1 } },
      { $project: { city: 0, country: 0 } },
    ]);

    if (!city) {
      return res.status(200).json({ message: "No new cities left" });
    }
    user.cities.push(city.cityId);
    await User.updateOne(
      { userId },
      { $push: { cities: city.cityId }, $set: { currentCityId: city.cityId } }
    );
    return res.json(city);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const getCity = async (req, res) => {
  try {
    const { cityId } = req.params;
    const city = await Cities.findOne(
      { cityId },
      { city: 0, country: 0 }
    ).lean();
    if (!city) {
      return res.status(404).json({ error: "City not found" });
    }
    return res.json(city);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const getAnswer = async (req,res) => {
    try{
        const {answer} = req.query;
        const {cityId} = req.params;
        const city = await Cities.findOne(
            { cityId }
          ).lean();
          if(answer===city.city)return res.status(200).json(true);
          return res.status(200).json(false);
    }catch (err) {
        return res.status(500).json({ error: "Server error" });
      }
}
