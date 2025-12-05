import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        displayName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        avatarUrl: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false,
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        likedPosts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        bookmarkedPosts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            displayName: this.displayName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);
