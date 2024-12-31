import express from "express"
import User from '../../../models/users.js'
import Post from '../../../models/posts.js'
import Comment from '../../../models/comments.js'
import CommentRouter from "./comment.route.js"




const router = express.Router()

router.post("/", async(req,res)=>{
    try{
        const {title, content, userId} =req.body
        const user = await User.findById(userId)
        if(!user)
            return res.status(400).json({mesaage: 'User does not exist'})
        const createdPost = await Post.create({
            title,
            content,
            author : user._id,
        });
        user.posts.push(createdPost._id)
        await user.save()

        // res.status(201).json(createdPost)
        res.redirect('/posts');

    }catch(e){
        res.status(500).json({message: e.message})
    }
});

router.get("/", async(req,res)=>{
    const {title} = req.query
    const findPosts = await Post.find({
        // title: {$regex: `.*${title}.*`, option: 'i'}
    })
    res.status(200).json(findPosts)
})

router.get("/postId", async (req,res)=>{
    const findPost = await Post.findById(req.params.postId)
    res.status(200).json(findPost)
})

router.put("/:postId", async (req,res)=>{
    const {title,content} = req.body
    const updatedPost = await Post.findByAndUpdate(req.params.postId,{
        title,content
    },{
        returnDocument : "after"
    })

    res.status(200).json(updatedPost)
})

router.delete("/:postId", async(req,res)=>{
    const deletePost = await Post.findByIdAndDelete(req.params.postId)

    await User.findByIdAndUpdate(deletePost.author,{
        $pull:{posts: deletePost._id}
    })
    await Comment.deleteMany({
        post: deletePost._id
    })

    res.status(204).json()

})
router.use('/:postId/comments', CommentRouter)


export default router