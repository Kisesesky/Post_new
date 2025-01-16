import passport from "passport";
import { Strategy as LocalStrategy} from "passport-local"
import bcrypt  from "bcrypt"
import User from '../models/users.js'
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import dotenv from 'dotenv'

const result = dotenv.config();


const config = {
    usernameField: "email",
    passwordField: "password"
}

const googleOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || ''
}

passport.use(
    new LocalStrategy(config, async function(email:string, password:string, done) {
        try{
            const user = await User.findOne({email})
            if(!user)
                return done(null, false, {message: "user not found"})
            const compareResult = await bcrypt.compare(password, user.password)
            if(!compareResult)
                return done(null, false, {message: "Invalid password"})
            
            return done(null, user)// true 생략가능
        }catch(e){
            done(e)
        }
    })
)

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.token || null
    ]),
    secretOrKey: process.env.JWT_SECRET_KEY || ''
};

passport.use(
    "jwt",
    new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
        try {
            const foundUser = await User.findById(jwtPayload._id);
            if (foundUser) {
                return done(null, foundUser);
            } else {
                return done(null, false, { message: "User not found" });
            }
        } catch (error) {
            return done(error, false);
        }
    })
);

passport.use(
    new GoogleStrategy(
        googleOptions, async(accessToken, refreshToken, profile, done) =>{
            try{
                const foundUser = await User.findOne({
                    socialId: profile._json.sub,
                    registerType: "google"
                })

                if(foundUser){
                    return done(null, foundUser)
                }

                const newUser = await User.create({
                    email: profile._json.email,
                    username: profile._json.name,
                    socialId: profile._json.sub,
                    registerType: "google"
                })

                return done(null, newUser)
            }
            catch(e){
                return done(e)

            }
        }
    )
)


//session방식
// passport.serializeUser(function(user, done) {  //response에 cookie를 실어줄 때 동작
//     done(null, user.id);
//   });

// passport.deserializeUser(async function (id, done) { // request에서 받아올 때 동작
//     const user = await User.findById(id)
//     // const {password, ...rest} = user.toObject()
//     // done(null, {...rest})
//     done(null, user)
// })



export default passport