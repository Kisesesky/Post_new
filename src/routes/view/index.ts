import express from 'express'
import postRouter from './posts.view.route.js'
import usersRouter from './users.view.router.js'
import commentsRouter from './comments.view.route.js'


const router = express.Router()

router.use("/posts", postRouter)
router.use("/users", usersRouter)
router.use("/comments", commentsRouter)



export default router
