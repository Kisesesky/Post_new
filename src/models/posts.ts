import mongoose,{ Schema, Document } from "mongoose";
import {IUser} from './users'
import {IComment} from './comments'


export interface IPost extends Document<mongoose.Types.ObjectId>{
    title: string;
    content: string;
    author: IUser;
    comments: IComment[];
}

const PostSchema = new Schema(
    {
        title : {
            type : String,
            required : true,
            // index : true
        },
        content : {
            type : String,
            required : true,
        },
        comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}],
        author: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
    },
    {
        timestamps: true,
    }
)
// PostSchema.index({title: 1}) // index 1 오름차순, -1 내람차순

const Post = mongoose.model<IPost>("Post", PostSchema)
export default Post