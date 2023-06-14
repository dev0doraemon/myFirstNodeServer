const express = require('express');
const app = express();
const port = 3000;

const connect = require('./schemas');

const noticeRouter = require('./routes/index');
// const postsRouter = require('./routes/posts');
// const commentRouter = require('./routes/comments');

connect();
app.use(express.json());

app.get("/", (req, res) => {
    console.log("hello");
})
app.use("/api", [noticeRouter]);

// app.use("/api", [postsRouter, commentRouter]);

// app.use("/api", [noticeRouter]);

app.listen(port, () => {
    console.log(port, "is listening.");
})