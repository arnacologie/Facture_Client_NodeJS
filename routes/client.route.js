module.exports = (app) => {

    const fs = require('fs');
    const apiPath = '/api/v1';
    const clientController = require('../controllers/client.controller.js');

    //create
    app.get(`${apiPath}/createClient`, (req, res)=>{
        let createFile = fs.readFileSync('./html/createClient.html', 'UTF-8');
        res.send(createFile);
    });
    app.post(`${apiPath}/createClient`, clientController.createClient);
    // //read
    app.get(`${apiPath}/read/:id`, clientController.findClient);
    app.get(`${apiPath}/read`, clientController.getClients);
    // //update
    app.put(`${apiPath}/update/:id`, clientController.updateClient);
    app.put(`${apiPath}/update`, clientController.updateClients);
    // //delete
    app.get(`${apiPath}/delete/:id`, clientController.deleteClient);
    app.get(`${apiPath}/delete`, clientController.deleteClientsGet);
    app.post(`${apiPath}/delete`,  clientController.deleteClientsPost);
    // //calculatetaxe
    app.get(`${apiPath}/calculate-taxe/:id`,  clientController.calculateTaxe);

    }