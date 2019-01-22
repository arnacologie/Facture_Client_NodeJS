const Invoice = require('../models/invoice.model');
const Client = require('../models/client.model');
const fs = require('fs');

exports.createInvoice = function(req, res){
    //console.log(req.body);
    let currentInvoiceNumber = 0;
    let currentClientName;
    let currentAddress;
    let currentCP;
    let currentTown;



    //find the last invoice number and create the current one
    Invoice.findOne().sort({createdAt: 'desc'}).lean().exec(function(err, lastInvoice) {
        if(err){
            console.log(err);
        }
        if(lastInvoice != null){
            console.log('1 '+lastInvoice.invoiceNumber.substring(1));
            currentInvoiceNumber = parseInt(lastInvoice.invoiceNumber.substring(1))+1;
        }
        else
            currentInvoiceNumber = 1;

        console.log(lastInvoice);

        console.log(`2 invoice number = ${currentInvoiceNumber}`);
        //res.send(`invoice number = ${currentInvoiceNumber}`);

        //find the client with the clientName for the facture
        Client.findOne({clientName: req.body.clientName}, function(err, client){
            if(err){
                console.log(err);
            }
            currentClientName = client.clientName;
            currentAddress = client.address;
            currentCP = client.cp;
            currentTown = client.town;
            
            //Manage the existence of the client's folder
            if(fs.existsSync(`invoices/${currentClientName}`)){
                console.log('repo exists');
            }
            else{
                fs.mkdirSync(`invoices/${currentClientName}`, { recursive: true }, (err) => {
                    console.log('repo created');
                })
            }
            createJSONBDDInvoice(currentInvoiceNumber, currentClientName, currentAddress, currentCP, currentTown);
            
            //LOG
            let logLine = `\n${new Date()} | ${currentClientName}`;
            fs.appendFileSync('invoices/factures.log', logLine, (err) => {
                console.log('factures.log edited');
            })
        });
    });

    function createJSONBDDInvoice(currentInvoiceNumber, currentClientName, currentAddress, currentCP, currentTown){
        //create JSON Facture
        createJSONInvoice(currentInvoiceNumber, currentClientName, currentAddress, currentCP, currentTown)
        //create BDD Invoice
        createBDDInvoice(currentInvoiceNumber);
    }

    function createJSONInvoice(currentInvoiceNumber, currentClientName, currentAddress, currentCP, currentTown){
        let invoice = {  
            invoiceNumber: createInvoiceName(currentInvoiceNumber),
            clientName: currentClientName, 
            clientAddress: currentAddress,
            clientCP: currentCP,
            clientTown: currentTown,
            creationDate: `${new Date()}`,
            prestation: req.body.prestation,
            numberHoraire: req.body.numberHoraire,
            priceHoraire: req.body.priceHoraire,
            TVARate: req.body.TVARate,
            totalHT: `${parseFloat(req.body.numberHoraire)*parseFloat(req.body.priceHoraire)}`,
            totalTTC: `${(parseFloat(req.body.numberHoraire)*parseFloat(req.body.priceHoraire) + parseFloat(req.body.numberHoraire)*parseFloat(req.body.priceHoraire)*(parseFloat(req.body.TVARate)/100.0))}`
        };

        let data = JSON.stringify(invoice, null, 2);

        fs.writeFileSync(`invoices/${currentClientName}/${createInvoiceName(currentInvoiceNumber)}.json`, data, (err) => {  
            if (err) console.log(err);
            console.log('Data written to JSON file');
            //res.send(data);
        });
    }

    function createInvoiceName(currentInvoiceNumber){
        let numberDigits = currentInvoiceNumber.toString().length;
        switch (numberDigits) {
            case 1:
                return `F000${currentInvoiceNumber}`;
            case 2:
                return `F00${currentInvoiceNumber}`;
            case 3:
                return `F0${currentInvoiceNumber}`;
            case 4:
                return `F${currentInvoiceNumber}`;
            default:
                console.log('currentInvoiceNumber is empty or contains more than 4 digits')
                break;
        }
    }

    function createBDDInvoice(){
        let invoice = new Invoice(
            {
                invoiceNumber : createInvoiceName(currentInvoiceNumber),
                totalTTC : (parseFloat(req.body.numberHoraire)*parseFloat(req.body.priceHoraire) + parseFloat(req.body.numberHoraire)*parseFloat(req.body.priceHoraire)*(parseFloat(req.body.TVARate)/100.0))
            }
        );
        invoice.save ((err) => {
            if(err){
                console.log(err);
            }else{
                console.log('Invoice BDD created :');
            }
            res.send(`Invoice BDD created ! \n\n${invoice}`);
        });
    }

    //Adventure.findOne({ type: 'iphone' }, function (err, adventure) {});

    //res.send(req.body);

    // let invoice = new Invoice(
    //     {
    //         reference: req.body.reference,
    //         name: req.body.name,
    //         description : req.body.description,
    //         priceHT : req.body.priceHT,
    //         TVARate : req.body.TVARate
    //     }
    // );
    // invoice.save((err) => {
    //     if(err){
    //         console.log(err);
    //     }else{
    //         console.log('Invoice created :');
    //     }
    //     res.send(invoice);
    // })
}



