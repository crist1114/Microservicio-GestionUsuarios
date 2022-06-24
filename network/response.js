exports.success = function(req, res, mensaje,status){

    const statusCode = status || 201;

    res.status(statusCode).send(mensaje);
    // res.status(statusCode).send({
    //     error: false,
    //     status: statusCode,
    //     body: mensaje,

    // });
}

exports.successAuth = function(req, res, mensaje,status){

    const statusCode = status || 201;

    // res.status(statusCode).send(mensaje);
    res.status(statusCode).send({
        error: false,
        status: statusCode,
        body: mensaje.token,
        usuario: mensaje.usuario

    });
}

exports.error = function(req, res, mensaje,status){

    const statusCode = status || 401;

    res.status(statusCode).send({
        error: true,
        status: statusCode,
        body: mensaje,

    });
}