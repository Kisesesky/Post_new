import express from "express"
import route from './routes/api/v1/index.js'
import viewRouter from "./routes/view/index.js"

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static("public"))

app.set("views", "./src/views")
app.set("view engine", "pug")

app.use('/api/v1', route)
app.use('/', viewRouter)

export default app