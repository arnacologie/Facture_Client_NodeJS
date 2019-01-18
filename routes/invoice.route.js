module.exports = (app) => {
    
    const apiPath = '/api/v1';
    const invoiceController = require('../controllers/invoice.controller.js');
    const fs = require('fs');

    app.get(`${apiPath}/createInvoice`, (req, res)=>{
        let createFile = fs.readFileSync('./html/createInvoice.html', 'UTF-8');
        res.send(createFile);
    });
    app.post(`${apiPath}/createInvoice`, invoiceController.createInvoice);
}