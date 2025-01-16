import express from "express"
import mongoose, { Schema, Document, Types } from "mongoose";
import Comment from '../../../models/comments.js'
import User from '../../../models/users.js'
import Post from '../../../models/posts.js'
import {Request, Response} from 'express'
import {IComment} from '../../../models/comments'
import {IPost} from '../../../models/posts'
import {IUser} from '../../../models/users'


const router = express.Router({mergeParams: true});

router.post('/', async (req:Request, res:Response): Promise<void>=>{
    const {content } = req.body
    const {postId} = req.params
    try{
        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).send('Post not found')
            return
        }
        const user = req.user
        if (!user) {
            res.status(404).send('User not found')
            return
        }
        

        const commentCreated: IComment = await Comment.create({
            content,
            post: postId,
            author: user._id,
        })
        user.comments.push(commentCreated._id)
        post.comments.push(commentCreated._id)
        await user.save()
        await post.save()

        // res.status(201).json(commentCreated)
        return res.redirect(req.get("Referrer") || "/");
    }
    catch(e: unknown){
        const custErr = e as Error
        res.status(500).json({message: custErr.message})
    }

})

router.get('/', async (req:Request,res:Response)=>{
    try {
        const postId = req.params.postId;
        const comments = await Comment.find({ post: postId }).populate('author', 'username');
        res.status(200).json(comments);
    } catch (e: unknown) {
        const custErr = e as Error
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/:commentId', async(req:Request,res:Response)=>{
    const {postId, commentId} = req.params
    
    const comment = await Comment.findById(commentId).populate("author", "username");
    res.status(200).json(comment)
})

router.put("/:commentId/edit", async (req:Request,res:Response):Promise<void> => {
    const { commentId } = req.params;
    const { content } = req.body;
    const user = req.user;

    try {
        const comment = await Comment.findById(commentId).populate("author");

        if (!comment) {
            res.status(404).send("Comment not found")
            return
        }

        comment.content = content;
        await comment.save();

        return res.redirect(req.get("Referrer") || "/");
    } catch (e:unknown) {
        const custErr = e as Error
        res.status(500).json({ message: custErr.message });
    }
});

router.delete('/:commentId', async(req:Request,res:Response)=> {
    const {commentId} = req.params
    
    const comment = await Comment.findByIdAndDelete({_id: commentId})
    if(!comment)
        throw new Error('error')
    console.log(comment)
    await User.findByIdAndUpdate(comment.author, {
        $pull: {comments: comment._id}
    })

    await Post.findByIdAndUpdate(comment.post, {
        $pull: {comments: comment._id}
    })

    res.status(204).send()

})
router.get('/:commentId/delete', async (req:Request,res:Response)=>{
    const user = req.user;
    const deletedComment = await Comment.findByIdAndDelete(req.params.commentId)
    if(!deletedComment)
        throw new Error('Not deletedComment')
    await User.findByIdAndUpdate(deletedComment.author,{
        $pull:{posts: deletedComment._id}
    })
    await Comment.deleteMany({
        post: deletedComment._id
    })
    return res.redirect(req.get("Referrer") || "/");
})

router.post("/:commentId/edit", async (req:Request,res:Response):Promise<void> => {
    const { content } = req.body;
    const commentId = req.params.commentId;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            res.status(404).json({ message: "Comment not found" })
            return
        }

        comment.content = content;
        await comment.save();

        res.redirect(req.get("Referrer") || "/");
    } catch (e:unknown) {
        const custErr = e as Error
        res.status(500).json({ message: custErr.message });
    }
});



export default router