const mysql = require('mysql');

const config = require('../config');

const dbconf = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
};

//coneccion
let connection;

function handleCon(){
    connection = mysql.createConnection(dbconf);

    connection.connect((err)=>{

        if(err){
            console.error('[db err]', err);
            setTimeout(handleCon, 2000);
        }
        else{
            console.log('DB connected!');
        }
    });

    connection.on('error', err => {
        console.error('[db err]', err);

        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            handleCon();
        } else  {
            throw err;
        }
    })
}

handleCon();

function list(table){

    return new Promise((resolve, reject)=>{
        connection.query(`SELECT * FROM ${table}`, (err, data)=> {
            if(err) return reject(err);

            resolve(data);
        })
    })
}

function get(tabla, id){
    console.log('el id en store ',id)
    return new Promise((resolve, reject)=>{
        connection.query(`SELECT * FROM ${tabla} WHERE id = '${id}'`, (err, data)=> {
            if(err) return reject(error);
            
            resolve(data);
        })
    })
}

function getPorCorreo(tabla, correo){

    return new Promise((resolve, reject)=>{
        connection.query(`SELECT * FROM ${tabla} WHERE username = '${correo}'`, (err, data)=> {
            if(err) return reject(error);

            resolve(data);
        })
    })
}

function getEstudiantes(tabla, rol){
    console.log('SE CONSULTARAAA')
    return new Promise((resolve, reject)=>{
        connection.query(`SELECT * FROM ${tabla} WHERE id_rol = '${rol}'`, (err, data)=> {
            if(err) return reject(error);

            resolve(data);
        })
    })
}
/**FOR ASINCRONO PARA TRAER VARIOS USUARIOS */
async function getEstudiantesProyecto(tabla, estudiantes){
    let estudiantesProyecto = [];
    
    
        for ( let elemento of estudiantes ) { 
            let est = await getEstudianteProyecto(tabla,elemento.idUsuario);
            estudiantesProyecto.push(est);
        }
        return new Promise((resolve, reject) => {
            if(!estudiantesProyecto) return reject('arreglo vacio');
            resolve(estudiantesProyecto);
        });
}



function getEstudianteProyecto(tabla, idUsuario){

        return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${tabla} WHERE id = '${idUsuario}'`, (err, res)=>{
            if(err) return reject(err);
            resolve(res[0] || null);
        })
    })
}

function insert(tabla, data){

    return new Promise((resolve, reject)=>{
        connection.query(`INSERT INTO ${tabla} SET ?`, data, (err, result)=> {
            if(err) return reject(err);

            resolve(result);
        })
    })
}

async function upsert(tabla, data){

    const us = await query(tabla, { id: data.id });

        if(!us){  
            console.log('se insertara en tabla ',data)
            return insert(tabla, data);
        }else{
            return update(tabla, data);
        }
}

/**Query que me busca el usuario que esta intentando iniciar sesion */
async function query(tabla, query){
    
    let rol = 0;
    connection.query(`SELECT * FROM user WHERE username = ?`, query.username, (err, res)=>{
        if(!err){
            console.log('NO HUBO ERROR')
            rol = res[0].id_rol;
        }
    })
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${tabla} WHERE ?`, query, (err, res)=>{
            if(err) return reject(err);
            if(rol!==0){
                res[0].id_rol = rol;
            }
            console.log('devuelve ',res[0])
            resolve(res[0] || null);
        })
    })
}

function update(tabla, data){

    return new Promise((resolve, reject)=>{
        connection.query(`UPDATE ${tabla} SET ? WHERE id=?`, [data, data.id], (err, result)=> {
            if(err) return reject(error);

            resolve(result);
        })
    })
}



module.exports = {
    list,
    get,
    upsert,
    query,
    getEstudiantes,
    getEstudiantesProyecto,
    getPorCorreo,
};