import express from 'express'
import Comment from '../../models/comments.js'
import Post from '../../models/posts.js'

const router = express.Router()


router.get('/:commentId/edit', async (req, res) => {
    try {
        const user = req.user;
        const comment = await Comment.findById(req.params.commentId).populate('author');
        const post = await Post.findById(comment.post);
        
        if (!comment.author._id.equals(user._id)) {
            res.status(403).send({ message: "Not authorized" });
        }

        res.render('commentsEdit', { comment: comment, post: post });
    } catch (e) {
        res.send(e.message);
    }
});

export default router