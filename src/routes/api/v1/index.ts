import express from "express";
import commentRouter from "./comments.route.js";
import postRouter from "./posts.route.js";
import userRouter from "./users.route.js";

const router = express.Router();

router.use('/comments', commentRouter);
router.use('/posts', postRouter);
router.use('/users', userRouter);

export default router;

document.getElementById