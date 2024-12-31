import express from 'express'
import postRouter from './posts.view.route.js'
import usersRouter from './users.view.router.js'

const router = express.Router()

router.use("/posts", postRouter)
router.use("/users", usersRouter)


export default router
