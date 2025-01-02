import express from "express"
import Comment from '../../../models/comments.js'
import User from '../../../models/users.js'
import Post from '../../../models/posts.js'

const router = express.Router({mergeParams: true});

router.post('/', async (req, res)=>{
    const {content } = req.body
    const postId = req.params.postId
    try{
        const user = req.userId
        const post = await Post.findById(postId)

        const commentCreated = await Comment.create({
            content,
            post: postId,
            author: userId
        })
        user.comments.push(commentCreated._id)
        post.comments.push(commentCreated._id)
        await user.save()
        await post.save()

        // res.status(201).json(commentCreated)
        res.redirect('back');
    }
    catch(e){
        res.status(500).json({message: e.message})
    }

})

router.get('/', async (req,res)=>{
    const postId = req.params.postId
    const comments = await Comment.find({post: postId})

    res.status(200).json(comments)
})

router.get('/:commentId', async(req, res)=>{
    const {postId, commentId} = req.params
    
    const comments = await Comment.find({post: postId})
    const comment = comments.find(item=>item._id == commentId)
    res.status(200).json(comment)
})

router.put('/:commentId', async(req, res)=> {
    const {commentId} = req.params
    const {content} = req.body
    
    const comment = await Comment.findByIdAndUpdate({_id: commentId},{
        content
    },{
        returnDocument: "after"
    })

    res.status(200).json(comment)

})
router.delete('/:commentId', async(req, res)=> {
    const {commentId} = req.params
    
    const comment = await Comment.findByIdAndDelete({_id: commentId})
    console.log(comment)
    await User.findByIdAndUpdate(comment.author, {
        $pull: {comments: comment._id}
    })

    await Post.findByIdAndUpdate(comment.post, {
        $pull: {comments: comment._id}
    })

    res.status(204).json()

})



export default router