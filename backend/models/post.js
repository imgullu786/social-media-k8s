import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        text : {
            type: String,
            max: 500,
        },
        img: {
            type: String,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        comments: [
            {
                text : { 
                    type: String,
                    required: true,
                },
                postedBy : {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
        }
        ],
    },{timestamps: true}
);

export default mongoose.model("Post", postSchema);