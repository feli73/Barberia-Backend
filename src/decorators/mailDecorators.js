
export function withLogging(enviarFn) {

  return async function (options) {

   console.log(`[LOG] enviando correo a: ${options.to}, asunto: ${options.subject}`);
   const result = await enviarFn(options);
   console.log(`[LOG] resultado del envío: ${result.response}`);
   return result;
  }

}