import mongoose, { Schema, Document, Types } from "mongoose";
import {IUser} from './users'
import {IPost} from './posts'


export interface IComment extends Document<mongoose.Types.ObjectId>{
    content: string;
    author: Types.ObjectId | IUser;
    post: Types.ObjectId | IPost;
}


const CommentSchema = new Schema(
    {
        content:{
            type : String,
            required : true,
        },
        post: {type: mongoose.Schema.Types.ObjectId, ref:"Post"},
        author: {type: mongoose.Schema.Types.ObjectId, ref:"User"}
    },
    {
        timestamps: true,
    }
)

const Comment = mongoose.model<IComment>("Comment", CommentSchema)

export default Comment