import mongoose,{ Schema } from "mongoose";
import  bcrypt from 'bcrypt';

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required : true,
        },
        email: {
            type: String,
            required: true,
            match: [/.*\@.*\..*/, "Please fill a valid email form"]
        },
        posts: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}],
        comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}]
    },
    {
        timestamps: true,
    }
)
UserSchema.pre('save', async function () {
    if(this.isNew || this.isModified('password'))
        this.password = await bcrypt.hash(this.password, 10)

})
const User = mongoose.model("User", UserSchema)

export default User;