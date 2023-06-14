const express = require("express");
const router = express.Router();
const Posts = require("../schemas/post");

const validateValue = require("../utils/validation");
const isEmptyObject = require("../utils/isEmptyObject");
const hasUndefined = require("../utils/hasUndefined");

router.post("/", async (req, res) => {
    if (isEmptyObject(req.body)) {
        return res
            .status(400)
            .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    // 임시 방편으로 postId 직접 주는 방식 사용
    // const { postId, title, user, password, content, createdAt } = req.body; 클라이언트에서 시간 생성할 경우 사용
    const { postId, title, user, password, content } = req.body;

    if (hasUndefined([title, user, password, content])) {
        return res
            .status(400)
            .json({ message: "존재하지 않는 key 값이 있습니다." });
    }

    // id 뭘로 줄지 생각하기
    try {
        const post = await Posts.findOne({ postId: Number(postId) });

        if (post) {
            return res.status(400).json({ message: "이미 있는 데이터입니다." });
        }

        const createdAt = new Date().toJSON();

        await Posts.create({
            postId: Number(postId),
            title,
            user,
            password,
            content,
            createdAt,
        });

        res.status(200).json({ message: "게시글을 생성하였습니다." });
    } catch (err) {
        console.error(`POST error message: ${err}`);
        res.status(400).json({ message: `${err}` });
    }
});

router.get("/", async (req, res) => {
    try {
        const posts = await Posts.find();

        if (!posts.length) {
            console.log("게시글이 없습니다.");
            return res.status(400).json({ message: "게시글이 없습니다." });
        }

        const data = posts
            .map((post) => {
                const { postId, title, user, createdAt } = post;
                return {
                    postId: Number(postId),
                    title,
                    user,
                    createdAt,
                };
            })
            .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
        
        res.status(200).json({ data });
    } catch (err) {
        console.error(`GET error message: ${err}`);
        res.status(400).json({ message: `${err}` });
    }
    // 날짜에 따라 정렬하는 기능 추가하기
});

router.get("/:postId", async (req, res) => {
    if (isEmptyObject(req.params)) {
        return res
            .status(400)
            .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    const { postId } = req.params;

    try {
        const post = await Posts.findOne({ postId: Number(postId) });

        if (!post) {
            console.log("게시글이 존재하지 않습니다.");
            return res
                .status(404)
                .json({ message: "게시글 조회에 실패하였습니다." });
        }

        const { user, title, content, createdAt } = post;
        const data = {
            postId: Number(postId),
            user,
            title,
            content,
            createdAt,
        };

        res.status(200).json({ data });
    } catch (err) {
        console.error(`GET error message: ${err}`);
        // res.status(400).json({ message: err });
        res.status(400).json({ message: `${err}` });
    }
});

router.put("/:postId", async (req, res) => {
    if (isEmptyObject(req.params) || isEmptyObject(req.body)) {
        console.log("PUT with no parameters!");
        return res
            .status(400)
            .json({ message: "데이터 형식이 올바르지 않습니다." });
    }

    const { postId } = req.params;
    const { title, user, password, content, createdAt } = req.body;

    if (hasUndefined([title, user, password, content, createdAt])) {
        return res
            .status(400)
            .json({ message: "존재하지 않는 key 값이 있습니다." });
    }

    try {
        const existsPost = await Posts.findOne({ postId: Number(postId) });

        if (!existsPost) {
            return res
                .status(404)
                .json({ message: "게시글 조회에 실패하였습니다." });
        }
        if (!validateValue(password, existsPost.password)) {
            return res
                .status(400)
                .json({ message: "비밀번호가 일치하지 않습니다." });
        }
        console.log("test");
        await Posts.updateOne(
            { postId: Number(postId) },
            { $set: { title, user, password, content, createdAt } }
        );
        res.status(200).json({ message: "게시글을 수정하였습니다." });
    } catch (err) {
        console.error(`PUT error message: ${err}`);
        // res.status(400).json({ message: err });
        res.status(400).json({ message: `${err}` });
    }
});

router.delete("/:postId", async (req, res) => {
    if (isEmptyObject(req.params) || isEmptyObject(req.body)) {
        return res
            .status(400)
            .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    const { postId } = req.params;
    const { password } = req.body;

    if (hasUndefined([password])) {
        return res
            .status(400)
            .json({ message: "존재하지 않는 key 값이 있습니다." });
    }

    try {
        const existsPost = await Posts.findOne({ postId: Number(postId) });
        if (!existsPost) {
            return res
                .status(404)
                .json({ message: "게시글 조회에 실패하였습니다." });
        }

        if (!validateValue(password, existsPost.password)) {
            return res
                .status(400)
                .json({ message: "비밀번호가 일치하지 않습니다." });
        }
        await Posts.deleteOne({ postId });

        res.status(200).json({ message: "게시글을 삭제하였습니다." });
    } catch (err) {
        console.error(`DELETE error message: ${err}`);
        res.status(400).json({ message: `${err}` });
    }
});

module.exports = router;
