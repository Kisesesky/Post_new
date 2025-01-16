import express from "express";
import route from './routes/api/v1/index.js';
import viewRouter from "./routes/view/index.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import commentRouter from './routes/api/v1/comments.route.js';
import postRouter from './routes/api/v1/posts.route.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use((req, res, next) => {
    if (!req.cookies["token"]) {
        return next();
    }
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user;
        next();
    })(req, res, next);
});

app.use('/api/v1/posts/:postId/comments', commentRouter);
app.use('/api/v1/posts', postRouter);
app.set("views", "./src/views");
app.set("view engine", "pug");

app.use('/api/v1', route);
app.use('/', viewRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

export default app;
