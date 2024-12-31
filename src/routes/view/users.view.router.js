import express from 'express'

const router = express.Router()

router.get("/signup", async(req,res)=>{
    res.render('signup')
})

export default router