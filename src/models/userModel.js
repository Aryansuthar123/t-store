import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { type: String, required: [true, "Please provide a username"] },
  email: { type: String, required: [true, "Please provide an email"], unique: true },
  password: { type: String, required: [true, "Please provide a password"] },
  image: { type: String },
  isVerified: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  resetOTP: { type: String },
  otpExpiry: { type: Date },
  otpVerified: { type: Boolean, default: false }, 
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcryptjs.hash(this.password, 10);
  next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
