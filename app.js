const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
require('./routes/client.route')(app);
require('./routes/invoice.route')(app);
require('./routes/client.note')(app);

const port = 3000;

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


// //read
// app.get(`${apiPath}/read/:id`, invoiceController.findInvoice);
// app.get(`${apiPath}/read`, invoiceController.getInvoices);
// //update
// app.put(`${apiPath}/update/:id`, invoiceController.updateInvoice);
// app.put(`${apiPath}/update`, invoiceController.updateInvoices);
// //delete
// app.get(`${apiPath}/delete/:id`, invoiceController.deleteInvoice);
// app.get(`${apiPath}/delete`, invoiceController.deleteInvoicesGet);
// app.post(`${apiPath}/delete`,  invoiceController.deleteInvoicesPost);
// //calculatetaxe
// app.get(`${apiPath}/calculate-taxe/:id`,  invoiceController.calculateTaxe);
