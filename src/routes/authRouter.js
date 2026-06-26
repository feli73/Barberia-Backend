import authController from '../controllers/authController.js';
import passport from '../config/passportConfig.js';
import { Router } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

router.post('/register', authController.register);

router.post('/login', authController.login);


router.post("/logout", authController.logout);

router.post('/Aforgot-password', authController.forgotPassword);

router.post('/reset-password', authController.resetPassword);

router.get('/profile', passport.authenticate('jwt', { session: false }),
    (req, res) => { 
     const{ password, __v, ...safeUser } = req.user._doc || req.user;
    
     res.json({  
        status: "success",
        payload: safeUser
     });

     }

)


export default router;