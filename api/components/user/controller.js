const TABLA = 'user';
const {nanoid} = require('nanoid');
const auth = require('../auth');

module.exports = function (injectedStore){

    const store = injectedStore;
    if(!store){
        store = require('../../../store/mysql');
    }

    function list(){

        return store.list(TABLA);
    }

    function get(id){
        return store.get(TABLA, id);
    }

/**Inserta o actualiza un usuario 
 * Envia los datos a auth para la encriptacion
 */
    async function upsert(body){

    /**Creo o actualizo el usuario */
        const user = {
                    name: body.name,
                    username: body.username,
                }
        

        if(body.id){
            user.id = body.id;  //si trae un id quiere decir que se va a editar
        }else{
            user.id = nanoid();
        }
        /**Aqui envio los datos a auth para la encriptacion */
        if(body.password || body.username){

            await auth.upsert({
                id: user.id,
                username: user.username,
                password: body.password,
            });
        }
        
        /**Aqui actualizo o inserto nombre, username y id */
        return store.upsert(TABLA, user);
    }
    
    return {
        list,
        get,
        upsert,
    }
    
}