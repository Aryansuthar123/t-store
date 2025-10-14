import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    
    category: {
      type: String,
      enum: ["top", "Trending", "MeetUs", "TopStories"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.About || mongoose.model("About", aboutSchema);
