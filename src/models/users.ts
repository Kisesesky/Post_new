import mongoose,{ Schema, Document } from "mongoose";
import  bcrypt from 'bcrypt';
import {IPost} from './posts'
import {IComment} from './comments'


export interface IUser extends Document<mongoose.Types.ObjectId>{
    username: string;
    email: string;
    password: string;
    registerType: "normal" | "google";
    posts: IPost[];
    comments: IComment[];
    socialId: string;
    birth: Date;
}

const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            minLength : 6
        },
        email: {
            type: String,
            required: true,
            match: [/.*\@.*\..*/, "Please fill a valid email form"]
        },
        registerType:{
            type: String,
            enum: ["normal", "google"],
            default: "normal"
        },
        socialId: String,
        birth:{
            type:Date
        },
       
        posts: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}],
        comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}]
    },
    {
        timestamps: true,
    }
)
UserSchema.pre('save', async function () {
    if(this.password && this.isNew || this.isModified('password'))
        this.password = await bcrypt.hash(this.password, 10)

})
const User = mongoose.model<IUser>("User", UserSchema)

export default User;