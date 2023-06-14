const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    postId: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    createdAt: {
        type: String
    },
});

// mongoose.model의 첫 번째 파라미터는 대문자로 저장해도 소문자가 되는듯..?
module.exports = mongoose.model("posts", postSchema);