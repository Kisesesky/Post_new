import express from 'express'
import User from '../../models/users.js'


const router = express.Router()

router.get("/signup", async(req,res)=>{
    res.render('signup')
})

router.get("/login", async (req,res)=>{
    res.render('login')
})
router.get("/logout", async (req,res)=>{
    // req.session.destroy((err)=>{
    //     if(err){
    //         console.log('session destroy failed')
    //         res.status(500).json({message: "session failed"})
    //     }
    // })
    // res.clearCookie('connect.sid')
    res.clearCookie('token')
    res.redirect('/posts')
})
router.get('/:userId/posts', async (req,res)=>{
    const user = req.user
    if(!user)
        return res.redirect('/login');
    const findUser = await User.findById(user._id).populate('posts')
    if(!findUser)
        throw new Error('error')
    
    res.render('myPost', { posts: findUser.posts || [] });

})
export default router