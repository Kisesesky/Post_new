import express from 'express'
import Post from '../../models/posts.js'
import { isUserValidator } from "../../validators/post.validator.js"




const router = express.Router()

router.get("/", async (req,res)=>{
    try{
        const user = req.user
        const page = +req.query.page || 1
        const size = +req.query.size || 5
        const posts = await Post.find()
            .populate('author', 'username')
            .sort({createdAt: -1})
            .skip(size*(page-1))
            .limit(size)
        if (!posts) {
            return res.status(404).send('Posts not found');
        }
        res.render("posts", {posts, size, page, user})
    }catch(e){
        res.status(500).json({message: e})
    }
    
})

router.get("/create", async(req,res)=>{
    try{
        // const user = await User.findOne()
        const user = req.user
        res.render('postCreate',{user})
    }catch(e){
        res.send(e.message)
    }
   
})

router.get("/:postId", async (req,res)=>{
    try{
        const user = req.user
        if(!user)
            throw new Error('Non found user')
        const post = await Post.findById(req.params.postId).populate({
            path: "comments",
            populate:{
                path: "author",
                select: "username"
            }
        })
        if(!post)
            throw new Error('Non found post')
        let isSameUser = false
        if(post.author._id.equals(user.id)){    /// equals ? === same
            isSameUser = true
        }
        res.render("post", {post, isSameUser: isSameUser})
    }catch(e){
        res.send(e.message)
    }
   
})

router.get('/:postId/edit', async (req,res)=>{
    try{
        const user = req.user
        if(!user)
            throw new Error('Non found user')
        const post = await Post.findById(req.params.postId)
        if(!post)
            throw new Error('Non found post')
    
        if(!post.author._id.equals(user.id)){
            res.status(403).send({message: "Not authorized"})
        }
        res.render('postEdit',{post})
    }catch(e){
        res.send(e.message)
    }
    
})




export default router
