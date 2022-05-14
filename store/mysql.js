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
            if(err) return reject(error);

            resolve(data);
        })
    })
}

function get(tabla, id){

    return new Promise((resolve, reject)=>{
        connection.query(`SELECT * FROM ${tabla} WHERE id = '${id}'`, (err, data)=> {
            if(err) return reject(error);

            resolve(data);
        })
    })
}

function insert(tabla, data){

    return new Promise((resolve, reject)=>{
        connection.query(`INSERT INTO ${tabla} SET ?`, data, (err, result)=> {
            if(err) return reject(error);

            resolve(result);
        })
    })
}

async function upsert(tabla, data){

    const us = await query(tabla, { id: data.id });

        if(!us){  
            console.log('oli')
            return insert(tabla, data);
        }else{
            console.log('actualizar')
            return update(tabla, data);
        }
}

/**Query que me busca el usuario que esta intentando iniciar sesion */
async function query(tabla, query){

    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${tabla} WHERE ?`, query, (err, res)=>{
            if(err) return reject(err);

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
};