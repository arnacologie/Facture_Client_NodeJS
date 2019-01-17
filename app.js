const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const factureController = require('./controllers/facture.controller.js');
const clientController = require('./controllers/client.controller.js');
const fs = require('fs');
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

const port = 3000;
const apiPath = '/api/v1';

app.listen(port, () => {
    console.log(`server on on port ${port}`)
});


mongoose.connect('mongodb://arnacologie1:arnacologie1@ds251804.mlab.com:51804/arnacobase',  { useNewUrlParser: true } , (err) => {
    if(err){
        console.log(('database not connected'));
    }
    else{
        console.log('database connected');
    }
});

//welcome
app.get(`/`, (req, res) => {
    res.send('"Je ne parviens pas à vous identifier"');
});
app.get(`/:name`, (req, res) => {
    res.send(`Bonjour ${req.params.name}, Bienvenue sur votre API de gestion de catalogue produit.`)
});

//CRUD Facture
//create
app.get(`${apiPath}/createFacture`, (req, res)=>{
    let createFile = fs.readFileSync('./html/createFacture.html', 'UTF-8');
    res.send(createFile);
});
app.post(`${apiPath}/createFacture`, factureController.createFacture);
app.post(`${apiPath}/createClient`, clientController.createClient);
// //read
// app.get(`${apiPath}/read/:id`, factureController.findFacture);
// app.get(`${apiPath}/read`, factureController.getFactures);
// //update
// app.put(`${apiPath}/update/:id`, factureController.updateFacture);
// app.put(`${apiPath}/update`, factureController.updateFactures);
// //delete
// app.get(`${apiPath}/delete/:id`, factureController.deleteFacture);
// app.get(`${apiPath}/delete`, factureController.deleteFacturesGet);
// app.post(`${apiPath}/delete`,  factureController.deleteFacturesPost);
// //calculatetaxe
// app.get(`${apiPath}/calculate-taxe/:id`,  factureController.calculateTaxe);
