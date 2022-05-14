

const controller = require('./controller');

const store = require('../../../store/mysql');

/**
 * Insertamos al controlador la store
 */
module.exports = controller(store);