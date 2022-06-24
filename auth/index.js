
/**Genereacion del TOKEN con jwt */

const jwt = require('jsonwebtoken');
const config = require('../config');
const error = require('../utils/error');
const secret = config.jwt.secret;

function sign(data){
  
    datos = JSON.parse( JSON.stringify(data));
    console.log('los datos de sign ',datos)
    return jwt.sign(datos, secret);    //le pasamos al usuario que esta haciendo login y un secreto
}

/**Verifica el token que acabe de sacar de la cabecera */
function verify(token){
    return jwt.verify(token, secret);
}


const check = {

    own: function(req, owner){
        const decoded = decodeHeader(req);   //decodificamos el token: gfhgfhfhfhgfhfhgft868ghj
        console.log('token decodificado ', decoded);//el token decoded es un objeto tipo {id, username, ...}

        if(decoded.id !== owner){
            throw error('No puedes hacer esto', 401);
        }
    }
}

function getToken(authorization){
    if(!authorization){
        throw error('No viene token', 401);
    }
    //el formato es Bearer tokenfdsfsdfsdf debo sacar el token 
    if(authorization.indexOf('Bearer ') === -1){ //si no encuantra la palabra bearer es formato invalido
        throw error('Formato invalido', 401);
    }
    let token = authorization.replace('Bearer ', ''); //le quito el bearer y me quedo con el token
    
    return token;
}

/**Funcion que decodifica el token recibe la request */
function decodeHeader(req){
    const authorization = req.headers.authorization || '';
    
    const token = getToken(authorization);  //saca el token de la cabecera
    const decoded = verify(token);  //verifico que el token es valido

    req.user = decoded; 

    return decoded;
}

module.exports = {

    sign,
    check,
}