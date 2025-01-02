import passport from "passport";
import LocalStrategy from "passport-local"
import bcrypt  from "bcrypt"
import User from '../models/users.js'


const config = {
    usernameField: "email",
    passwordField: "password"
}

passport.use(
    new LocalStrategy(config, async function(email, password, done) {
        try{
            const user = await User.findOne({email})
            if(!user)
                return done(null, false, {message: "user not found"})
            const compareResult = await bcrypt.compare(password, user.password)
            if(!compareResult)
                return done(null, false, {message: "Invalid password"})
            
            return done(null, user)// true 생략가능
        }catch(e){
            done(e, null)
        }
    })
)

passport.serializeUser(function(user, done) {  //response에 cookie를 실어줄 때 동작
    done(null, user.id);
  });

passport.deserializeUser(async function (id, done) { // request에서 받아올 때 동작
    const user = await User.findById(id)
    done(null, user)
})

export default passport