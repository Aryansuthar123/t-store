    import mongoose from "mongoose";
    import bcryptjs from "bcryptjs";

    const userSchema  = new mongoose.Schema({
       username: { type: String, required: [true, "Please provide a username"] },

        email: { type: String, required: [true, "Please provide a Email"], unique: true },
        password: { type: String, required: [true, "Please provide a Password"] },
        image:    { type: String },   
        isVerified: { type: Boolean, default: false }, 
        isAdmin: { type: Boolean, default: false },
        isApproved: { type: Boolean, default: false },
        forgotPasswordToken: String,
        forgotPasswordTokenExpiry: Date,
        verifyToken: String,
        verifyTokenExpiry: Date,
    })

    userSchema.pre("save", async function(next) {
        if (!this.isModified("password")) return next();
        this.password = await bcryptjs.hash(this.password, 10);
        next();
    });

    const User = mongoose.models.User || mongoose.model('User', userSchema);
    export default User;
