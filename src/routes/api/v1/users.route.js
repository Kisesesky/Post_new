import express from 'express'
import User from '../../../models/users.js'
import bcrypt from "bcrypt"
import passport from 'passport';

const router = express.Router()

//유효성검사
const signUpValidator = async (req,res,next) => {
    const{username, email, password, passwordConfirm, birth} =req.body
    if(!username || !email || !password || !passwordConfirm || !birth){
        return res.status(400).json({message: "All fields are required!"})
    }
    if(password !== passwordConfirm){
        return res.status(400).json({message: "password and passwordConfirm are difference!!"})
    }
    const emailRegex = new RegExp(
        /.*\@.*\..*/
    )
    if(!emailRegex.test(email))
        return res.status(400).json({message: "Not email Type!!"})

    const user = await User.findOne({email: email})
    if(user)
        return res.status(400).json({mesaage: 'Email alreday exists'})

    next()
}

router.post("/signup", signUpValidator, async (req,res)=>{
    try{
        const{username, email, password, passwordConfirm, birth} =req.body

        // const encryptedPassword = await bcrypt.hash(password, 10)//숫자가 높을수록 보안이 높지만 오래걸림, random value
        
        const user = await User.create({
            username,
            email,
            birth,
            password, //: encryptedPassword
            passwordConfirm
        })
        // res.status(201).json(user)
        res.redirect('/posts')
    }catch(e){
        res.status(500).json({message: e.message})
    }
    
})

router.post('/signin', async (req,res)=>{
    const{email, password} =req.body
    try{
       const user = await User.findOne({email})
       if(!user){
            res.status(400).json({message: 'User not found'})
        }

       const compareResult = await bcrypt.compare(password, user.password)
    //    if(compareResult)
    //         res.status(200).json(user)
    //    res.status(400).json({mesaage: 'Invalid Password'})
       if(!compareResult)
            res.status(400).json({mesaage: 'Invalid Password'})
       res.cookie('loggedInUser', encodeURIComponent(JSON.stringify(user)),{
        expires: new Date(Date.now() + 90000),
        httpOnly: true
       })
       res.status(200).json({message: 'login sucess'})


    }catch(e){
        res.status(500).json({message: e.message})
    }
})
router.post('/login',passport.authenticate("local",{
    successReturnToOrRedirect: "/posts",
    failureMessage: true
}))

export default router
