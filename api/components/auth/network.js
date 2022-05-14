const express = require('express');

const router = express.Router();

const response = require('../../../network/response');

const controller = require('./index');

/**Este network es para hacer login*/

router.post('/login', function(req, res ){
    console.log('haceindo login para ' , req.body)
    controller.login(req.body.username, req.body.password)
    .then(token => {
        res.setHeader("Authorization", "Bearer ", token);
        response.success(req, res, token, 200);
    })
    .catch(e => {
        response.error(req, res, 'info invalida', 400);
    });
});

module.exports = router;