import express from 'express'

const router = express.Router()

router.get("/signup", async(req,res)=>{
    res.render('signup')
})

router.get("/login", async (req,res)=>{
    res.render('login')
})
router.get("/logout", async (req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log('session destroy failed')
            res.status(500).json({message: "session failed"})
        }
    })
    res.clearCookie('connect.sid')
    res.redirect('/posts')
})
export default router