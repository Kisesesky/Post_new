import express from 'express'
import Post from '../../models/posts.js'
import User from '../../models/users.js'



const router = express.Router()

router.get("/", async (req,res)=>{
    const user = req.user
    const page = +req.query.page || 1
    const size = +req.query.size || 5
    const posts = await Post.find()
        .populate('author', 'username')
        .sort({createdAt: -1})
        .skip(size*(page-1))
        .limit(size)
    res.render("posts", {posts, size, page, user})
})

router.get("/create", async(req,res)=>{
    // const user = await User.findOne()
    const user = req.user
    res.render('postCreate',{user})
})

router.get("/:postId", async (req,res)=>{
    const post = await Post.findById(req.params.postId).populate({
        path: "comments",
        populate:{
            path: "author",
            select: "username"
        }
    })
    res.render("post", {post})
})


export default router
