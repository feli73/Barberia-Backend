import { enviar } from "../services/mailingService.js";
import { withLogging } from "../decorators/mailDecorators.js";

const enviarConLog = withLogging(enviar);

const mailProxy = new Proxy(enviarConLog, {   

  apply: async (target, thisArg, args) => {

   const options = args[0];
   console.log(`[PROXY] validando correo a : ${options.to}`);

   if(!options.to || !options.subject ) {  

      throw new Error("Faltan datos obligatorios para enviar correo");

    }

    try { 
     const result = await Reflect.apply(target, thisArg, args);
     console.log("[PROXY] Envío exitoso: ", result.response);
     return result;

    } catch(err) {

      console.error("[PROXY] Error al enviar, reintentando...");

      return await Reflect.apply(target, thisArg, args);

    }
   }



});

export default mailProxy;

