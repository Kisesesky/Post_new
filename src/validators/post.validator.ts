import Post from '../models/posts.js'



export async function isUserValidator(req, res, next){
    const user = req.user
    if(!user)
        res.send('Not Authorized.')
    next()
}

export async function isSameUserVlidator(req,res,next){
    const user = req.user
    if(!user)
        res.send('Not Authorized.')

    const post = await Post.findById(req.params.postId)

    if(!post.author._id.equals(user._id))
        res.send('Not Authorized.')
    next()
}