const auth = require('../../../auth');

module.exports = function checkAuth(action){  //update
    
    function middleware(req, res, next){

        switch(action){
            /**Verificamos que el usuario que ha generado el token es el mismo usuario que queremos comprobar */
            case 'update': 
                const owner = req.body.id;
                console.log(owner)
                auth.check.own(req, owner);
                next();
                break;

            default:
                next();
        }
         
    }

    return middleware;
}