module.exports = (app) => {

    const apiPath = '/api/v1';
    const clientController = require('../controllers/client.controller.js');

    app.post(`${apiPath}/createClient`, clientController.createClient);
}