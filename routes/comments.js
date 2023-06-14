const express = require("express");
const router = express.Router();
const Comments = require("../schemas/comment");

const validateValue = require("../utils/validation");
const isEmptyObejct = require("../utils/isEmptyObject");
const hasUndefined = require("../utils/hasUndefined");

router.post("/:postId", async (req, res) => {
    if (isEmptyObejct(req.body) || isEmptyObejct(req.params)) {
        return res
            .status(400)
            .json({ message: "데이터 형식이 올바르지 않습니다." });
    }

    const { postId } = req.params;
    // 임시 방편으로 commentId 직접 주는 방식 사용
    // commentId를 어떻게 자동으로 부여할지 생각해보기
    // const { commentId, content, user, password, createdAt } = req.body; 클라이언트에서 생성할 경우
    const { commentId, content, user, password } = req.body; // 서버에서 시각 정보를 호출할 경우

    if (hasUndefined([commentId, content, user, password])) {
        return res
            .status(400)
            .json({ message: "존재하지 않는 key 값이 있습니다." });
    }

    // 댓글 내용을 비워둔 채 댓글 작성 API를 호출하면 "댓글 내용을 입력해주세요"라는 메세지 출력
    if (content.trim() === "") {
        return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
    }

    try {
        const comment = await Comments.findOne({ commentId: Number(commentId) });

        if (comment) {
            return res.status(400).json({ message: "이미 있는 데이터입니다." });
        }
        const createdAt = (new Date()).toJSON();

        await Comments.create({
            commentId: Number(commentId),
            postId,
            content,
            user,
            password,
            createdAt,
        });

        res.json({ message: "게시글을 생성하였습니다." });
    } catch (err) {
        console.error(`POST error message: ${err}`);
        // 아래 에러 내용 반환하는 코드 비교하기
        // res.status(400).json({ message: err });
        res.status(400).json({ message: `${err}` });
        // res.status(400).json({ err });
    }
});

// map 방식으로 처리
router.get("/:postId", async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comments.find({ postId: Number(postId) });
        if (!comments.length) {
            return res
                .status(400)
                .json({ message: "댓글이 존재하지 않습니다. " });
        }

        const data = comments.map((comment) => {
            const { commentId, content, user, createdAt } = comment;
            return {
                commentId: Number(commentId),
                content,
                user,
                createdAt,
            };
        }).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

        res.status(200).json({ data });
    } catch (err) {
        console.error(`GET error message: ${err}`);
        // res.status(400).json({ message: err });
        res.status(400).json({ message: `${err}` });
    }
    // 날짜에 따라 정렬하는 기능 추가하기
});

router.put("/:commentId", async (req, res) => {
    // 요 부분 어떻게 하는지 다시 보기
    // localhost:3000/api/posts/e 이런 식으로 요청하면 바로 아래 부분이 아니라
    // catch 부분이 실행되어버림
    // 그리고 아래에서 각 키 값이 있는지 확인 하는데 이 부분이 필요할까?
    if (isEmptyObejct(req.body) || isEmptyObejct(req.params)) {
        // console.log("PUT with no parameters!");
        return res
            .status(400)
            .json({ message: "데이터 형식이 올바르지 않습니다." });
    }


    const { commentId } = req.params;
    const { user, password, content, createdAt } = req.body;

    if (hasUndefined([user, password, content, createdAt])) {
        return res
            .status(400)
            .json({ message: "존재하지 않는 key 값이 있습니다." });
    }

    // 댓글 내용을 비워둔 채 댓글 작성 API를 호출하면 "댓글 내용을 입력해주세요"라는 메세지 출력
    if (content === "") {
        return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
    }

    try {
        const existsPost = await Comments.findOne({
            commentId: Number(commentId),
        });

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
        // console.log("test");
        await Comments.updateOne(
            { commentId: Number(commentId) },
            { $set: { content, user, createdAt } }
        );

        res.status(200).json({ message: "게시글을 수정하였습니다." });
    } catch (err) {
        console.error(`PUT error message: ${err}`);
        // res.status(400).json({ message: err });
        res.status(400).json({ message: `${err}` });
    }
});

router.delete("/:commentId", async (req, res) => {
    if (isEmptyObejct(req.body) || isEmptyObejct(req.params)) {
        return res
            .status(400)
            .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    // console.log(req.body);
    const { commentId } = req.params;
    const { password } = req.body;

    // 키의 대소문자 구분도 해야할까?
    if (hasUndefined([password])) {
        return res
            .status(400)
            .json({ message: "존재하지 않는 key 값이 있습니다." });
    }

    try {
        const existsComment = await Comments.findOne({
            commentId: Number(commentId),
        });
        if (!existsComment) {
            return res
                .status(404)
                .json({ message: "게시글 조회에 실패하였습니다." });
        }

        if (!validateValue(password, existsComment.password)) {
            return res
                .status(400)
                .json({ message: "비밀번호가 일치하지 않습니다." });
        }

        await Comments.deleteOne({ commentId: Number(commentId) });
        res.status(200).json({ message: "게시글을 삭제하였습니다." });
    } catch (err) {
        console.error(`DELETE error message: ${err}`);
        // res.status(400).json({ message: `Error message ${err}`});
        res.status(400).json({ message: `${err}` });
    }
    // try 없을때는 왜 아무 동작도 안했지??
    // try {
    //     await Posts.deleteOne({ postId });
    // } catch (err) {
    //     console.error(err);
    // }
});

module.exports = router;
