const express = require('express');

const router = express.Router();
const secure = require('./secure'); //el middleware
const response = require('../../../network/response');

const controller = require('./index');


router.get('/', function(req, res, next){
    
    controller.list()
    .then((list)=>{
        response.success(req,res,list, 200);
    })
    .catch(next);

});

router.get('/:id', function(req, res, next){
    
    controller.get(req.params.id)
    .then((user)=>{
        response.success(req,res,user, 200);
    })
    .catch(next);

});

router.post('/', function(req, res, next){
    
    // console.log(req.body);
    controller.upsert(req.body)
    .then((user)=>{
        response.success(req,res,user, 200);
    })
    .catch(next);

});

router.put('/', secure('update'), function(req, res, next){
    
    // console.log('se autenticó',req.body);
    controller.upsert(req.body)
    .then((user)=>{
        response.success(req,res,user, 200);
    })
    .catch(next);

});

module.exports = router;