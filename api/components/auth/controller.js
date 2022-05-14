/*
    Aqui se guardara la contraseña
*/
const auth = require('../../../auth');  //el auth que me genera el token

const bcrypt = require('bcrypt');

const TABLA = 'auth';

const nonoid = require('nanoid');

/**
 * Injectando la store y verificando que sea la store que pedimos
 */
module.exports = function (injectedStore){

    const store = injectedStore;

    if(!store){
        store = require('../../../store/mysql');
    }

    /**
     * Funcion para login
     */
    async function login(username, password){
        console.log('estoy en contorller con las credenciales', username, password)
        /**Me traigo el usuario que esta intentando iniciar sesion de la bd*/
        const data = await store.query(TABLA, { username: username });
        console.log('se encontró ',data)
        //Desencripto la contraseña primero, es una promesa
        return bcrypt.compare(password, data.password)  //bcrypt compara las contraseñas
            .then((sonIguales) => {
                
                if(sonIguales){
                    //Generar token;
                    console.log('si son iguales')
                    return auth.sign(data);    //voy a autorizar el usuario que hace login
                }
                else{
                    throw new Error('Informacion invalida');
                }
            });
        
    }

/**
 * Funcion para insertar usuario
 * revisa si hay un username, un password y lo actualiza
 */
    async function upsert(data){

        const authData = {
            id: data.id,    //me aseguro que siempre haya un id
        }
        //miro si existen estos datos y los actualizo
        if(data.username){
            authData.username = data.username;   //si viene un username 
        }

        if(data.password){

            authData.password = await bcrypt.hash(data.password, 5);  //bcrypt hashea la password para que no la guarde en limpio
        }
        /**Aqui actualizo o inserto id, username y password */
        return store.upsert(TABLA, authData);
    }



    return {
        upsert,
        login,
    };
}