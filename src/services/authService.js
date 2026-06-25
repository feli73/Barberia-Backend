import bcrypt from 'bcrypt';
import userRepository from '../repository/userRepository.js';
import jwt from 'jsonwebtoken';
import AuthDto from '../dtos/authDto.js'
import normalizeText from '../utils/normalizedText.js';

class AuthService {

    constructor(repository){
        this.repository = repository
    }


  register = async (data) => {

  const exist = await this.repository.getByEmail(data.email);
  if(exist) throw new Error("El mail ya está registrado.");

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const finalRole = data.role === 'admin' ? 'admin' : 'user';

  const user = await this.repository.create({ 
        ...data,
        first_name_normalized: normalizeText(data.first_name),
        last_name_normalized: normalizeText(data.last_name),
        password: hashedPassword,
        role: finalRole,

    });

    return user;


  }


login = async (email, password) => {

  const user = await this.repository.getByEmailRaw(email);
  if(!user) { throw new Error('Usuario no encontrado') }


  console.log("USER:", user);
  console.log("USER PASSWORD:", user.password);
  console.log("INPUT PASSWORD:", password);

  const match = await bcrypt.compare(password, user.password);

  if(!match) { throw new Error('Credenciales inválidas') }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  return new AuthDto({  _id: user._id,    // asi se evita pasar el password, es mas seguro
  first_name: user.first_name,
  last_name: user.last_name,
  email: user.email,
  age: user.age,
  role: user.role,
  token })

}



}

const authService = new AuthService(userRepository);

export default authService;