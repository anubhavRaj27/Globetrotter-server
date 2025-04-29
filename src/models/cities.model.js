import mongoose from "mongoose";

const CitiesSchema = new mongoose.Schema({
  cityId:   { type: String, unique: true },
  city:     String,
  country:  String,
  clues:    [String],
  fun_fact:  [String],
  trivia:   [String],
  options:  [String],
}, { timestamps: true });

const Cities = mongoose.model("Cities", CitiesSchema);
export default Cities;
