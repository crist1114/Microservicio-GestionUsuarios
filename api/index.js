const express = require('express');
const cors = require('cors')
const swaggerUi = require('swagger-ui-express');

const app = express();

const config = require('../config.js');
const user = require('./components/user/network.js');
const auth = require('./components/auth/network.js');
const errors = require('../network/errors');

const bodyParser = require('body-parser');
const swaggerDoc = require('./swagger.json');

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, 	X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-	Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, 	DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            // Dirección desde donde se pueden hacer peticiones
            // if (!["http://localhost:4200"].includes(origin)) {
            //     return callback(new Error(`La política CORS para el origen ${origin} no permiten el acceso al servidor.`), false);
            // }
            return callback(null, true);
        }
    })
);

app.use(bodyParser.json());
//ROUTER
app.use('/api/user', user);
app.use('/api/auth', auth);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));





app.use(errors);


app.listen(config.api.port, ()=>{
    console.log('Api escuchando en el puerto ', config.api.port);
});