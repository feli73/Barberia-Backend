import authService from "../services/authService.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../dao/models/userModel.js';
import mailProxy from "../proxies/mailProxy.js";
import dotenv from 'dotenv';
dotenv.config();


class AuthController{
 constructor(authService){
    this.authService = authService;

 }


  register = async (req, res)  => {

     try {
         const result = await this.authService.register(req.body);
         res.status(201).json({ status: 'success', payload: result });

     } catch(err) {
      console.log(err.message)
       res.status(400).json({ status: 'Error', payload: err.message });

     }

  }



  login = async (req, res) => {

  try { 
     const { email, password } = req.body;
     const result = await this.authService.login(email, password);
     
     res.cookie("token", result.token, {
      httpOnly: true,
      secure:true,
      sameSite: "none",
       path: "/",
      maxAge: 60 * 60 * 1000

     });
     
     
     res.json({ status: 'success', payload: result })

  } catch(err) {

     res.status(401).json({ status: 'error', payload: 'Error al realizar el Login' })

  }


  }


 

  forgotPassword = async (req, res) => {

   const { email } = req.body;
   const user = await User.findOne({ email });
   if(!user) { return res.status(404).json({ error: 'Usuario no encontrado' })}

   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });  


  await mailProxy ({  
      to: user.email,
      subject: "Recuperación de contraseña",
      html: ` <p>Haz clic en el siguiente enlace para recuperar tu contraseña</p>
      <a href="${process.env.DEPLOY_FRONTEND_URL}/nuevopassword?token=${token}">
      Recuperar contraseña
      </a>
      
      `

  });


  res.json({ message: "Correo enviado" });

}




resetPassword = async (req, res) => {

   const { token, newPassword } = req.body;

   try {
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     const user = await User.findById(decoded.userId)
     if(!user) return res.status(404).json({ error: 'Usuario no encontrado' });

     const isSame = await bcrypt.compare(newPassword, user.password);
     if(isSame){
      return res.status(404).json({ error: 'La nueva contraseña no puede ser igual a la anterior' })
     }

     const hashedPassword = await bcrypt.hash(newPassword, 10)
     user.password = hashedPassword;
     await user.save();

    res.json({ message: "Contraseña actualizada correctamente" });
    } catch (err) {

       res.status(400).json({ error: "token inválido o expirado" });
    }


}




logout= (req, res) => {

 res.clearCookie('token', {
  httpOnly: true,
  secure: true,
  sameSite: "none"
});
 res.json({ status: 'success', message: 'Sesión cerrada' });
}




}



const authController = new AuthController(authService);

export default authController;