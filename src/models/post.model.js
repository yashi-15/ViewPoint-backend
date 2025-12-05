import mongoose, { Schema } from "mongoose"

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    coverImage: {
        type: String,
        default: ""
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    


}, { timestamps: true})

export const Post = mongoose.model("Post", postSchema)