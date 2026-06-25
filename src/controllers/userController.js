import userService from "../services/userService.js";

class UserController{
   constructor(service){
     this.service = service;

   }


  create = async (req, res) => {

   try {
      const result = await this.service.create(req.body);
      return res.status(201).send({ status: "success" , payload: result })

   } catch (err) {

     return res.status(400).send({ status: 'Error', message: 'Error al crear el usuario'  })

   }

  }


  getAll = async (req, res) => {
  
    try {
         const result = await this.service.getAll();
         return res.send({ status: 'success', payload: result });

    } catch(err) {
      
       return res.status(400).send({ status: 'Error', message: 'Error al cargar todos los usuarios' })

    }

}



getById = async (req, res) =>  {

  try {  

    const result = await this.service.getById(req.params.id);

    if(!result) {
        return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' })

    }

    return res.send({ status: 'success', payload: result });

} catch(err) {

    return res.status(400).send({ status: 'Error', message: 'Error al cargar el usuario' });

  }

}


  getByEmail = async(req, res) => {

  try{
      const result = await this.service.getByEmail(req.query.email);
      
       if (!result) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }
      
      return res.json({ status: 'success', payload: result });

  } catch(err){

   res.status(500).json({ status: 'error', message: 'Error al buscar el email' })

  }

  }


   searchByName = async (req, res) => {

    try {

    const { name, lastName } = req.query;
  const users = await this.service.searchByName({ name, lastName });
  res.json({ status:'success',  payload: users })

    } catch(err) {

      res.status(500).json({ status: 'error', message: 'Error en búsqueda' });

    }

  

  }




 update = async (req, res) => {

 try {

    const result = await this.service.update(req.params.id, req.body, req.user);
    return res.send({ status: 'success', payload: result });
 
  } catch (err) {


    return res.status(400).send({ status: 'Error', payload: 'Error al actualizar el usuario' })

  }

 } 


 delete = async (req, res) => {

  try {

    

      const result = await this.service.delete(req.params.id, req.user);
      return res.send({ status: 'success', payload: result });    

  } catch(err) {


    return res.status(400).send({ status: 'Error', payload: ' Error al eliminar el usuario' })

  }


 }



 promoteToAdmin = async (req, res) => {

  try {
    const result = await this.service.promoteToAdmin(req.params.id, req.user);
    return res.send({ status: 'success', payload: result });
  } catch(err) {
    return res.status(403).send({ status: 'Error', message: 'Error al promover el usuario a admin' })

  }

 }





}



const userController = new UserController(userService);

export default userController;