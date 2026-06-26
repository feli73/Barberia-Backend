import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import  authService  from '../services/authService.js';
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import userModel from '../dao/models/userModel.js';
import dotenv from 'dotenv';
dotenv.config();

passport.use('login', new LocalStrategy(

{ usernameField: 'email' },
async (email, password, done) => {

try {
  const userWithToken = await authService.login(email, password);
  return done(null, userWithToken);

} catch (err) {
  return done(null, false , { message: 'error de autenticación' })

}

}

));


const cookieExtractor = req => {
  console.log("COOKIES:", req.cookies);
  console.log("HEADERS COOKIE:", req.headers.cookie);

  return req.cookies?.token || null;
};

const opts = { 

 jwtFromRequest: cookieExtractor, 
 secretOrKey: process.env.JWT_SECRET,
 }


passport.use("jwt", new JwtStrategy(opts, async (jwt_payload, done) => {

  try {
    const user = await userModel.findById(jwt_payload.id).select('-password');
    if(user) return done (null, user);
    else return done(null, false);

  } catch (err) {
    return done(err, false)

  }


} ))



 export default passport;

