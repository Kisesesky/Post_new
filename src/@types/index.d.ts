import { IUser } from "../models/users"
import { IPost } from "../models/posts"
import { IComment } from "../models/comments"
import { Request } from 'express';



declare global{
    namespace Express{
        export interface User extends Omit<IUser, "password">  {}

        export interface Request {
            post?: IPost;
            commnet?: IComment;
        }
    }
}