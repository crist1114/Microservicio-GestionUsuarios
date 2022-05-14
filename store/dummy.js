const db = {

    'user': [
        {
            id: '1',
            nombre: 'Carlos',
        },
    ]
};

async function list(tabla){

    return db[tabla];
}

async function get(tabla, id){

    let coleccion = await list(tabla);
    return coleccion.filter(item=> item.id === id)[0] || null;
}

/**Query que me busca el usuario que esta intentando iniciar sesion */
async function query(tabla, data){

    let coleccion = await list(tabla);
    let keys = Object.keys(data);
    let key = keys[0];   //seria el username

    //reviso si el username de la coleccion es igual a mi username
    return coleccion.filter(item=> item[key] === data[key])[0] || null;
}

async function upsert(tabla, data){

    if(!db[tabla]){
        db[tabla] = [];
    }
    db[tabla].push(data);

    console.log(db)
}

async function remove(tabla, id){

    let coleccion = await list(tabla);

    let user = coleccion.filter(item=> item.id === id)[0];

    db[tabla].remove(user);

    return true;
}

module.exports = {
    list,
    get,
    upsert,
    remove,
    query,
};