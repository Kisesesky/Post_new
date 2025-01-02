import express from "express"
import route from './routes/api/v1/index.js'
import viewRouter from "./routes/view/index.js"
import cookieParser from "cookie-parser"
import session from "express-session"
import MongoStore from "connect-mongo"
import passport from "passport"

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static("public"))
app.use(cookieParser())
app.use(
    session({
        secret: "hello world",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: "mongodb://127.0.0.1:27017/mongoose-repeat",
        })
    })
)
app.use(passport.authenticate("session"))

app.set("views", "./src/views")
app.set("view engine", "pug")

app.use('/api/v1', route)
app.use('/', viewRouter)

export default app