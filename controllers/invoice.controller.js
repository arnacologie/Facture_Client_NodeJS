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
    Invoice.findOne().sort({ field: 'asc', _id: -1 }).limit(1).exec(function(err, lastInvoice) {
        if(err){
            console.log(err);
        }
        if(lastInvoice != null){
            console.log('1 '+lastInvoice.invoiceNumber.toString().substring(1));
            currentInvoiceNumber = parseInt(lastInvoice.invoiceNumber.toString().substring(1))+1;
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
            createJSONBDDInvoice(currentInvoiceNumber, currentClientName, currentAddress, currentCP, currentTown, req.body.prestation,
                req.body.numberHoraire, req.body.priceHoraire, req.body.TVARate, res);
            
            //LOG
            let logLine = `\n${new Date()} | ${currentClientName}`;
            fs.appendFileSync('invoices/factures.log', logLine, (err) => {
                console.log('factures.log edited');
            })
        });
    });
}

    exports.logAllIncome = function(req, res){
        console.log(fs.readFileSync('invoices/total.log', 'UTF-8'));
    }

    function createJSONBDDInvoice(currentInvoiceNumber, currentClientName, currentAddress, currentCP, currentTown, prestation, numberHoraire, priceHoraire, TVARate, res){
        //create JSON Facture
        createJSONInvoice(currentInvoiceNumber, currentClientName, currentAddress, currentCP, currentTown, prestation, numberHoraire, priceHoraire, TVARate)
        //create BDD Invoice
        createBDDInvoice(currentInvoiceNumber, numberHoraire, priceHoraire, TVARate, res);
    }

    function createJSONInvoice(currentInvoiceNumber, currentClientName, currentAddress, currentCP, currentTown, prestationReq, numberHoraireReq, priceHoraireReq, TVARateReq){
        let invoice = {  
            invoiceNumber: createInvoiceName(currentInvoiceNumber),
            clientName: currentClientName, 
            clientAddress: currentAddress,
            clientCP: currentCP,
            clientTown: currentTown,
            creationDate: `${new Date()}`,
            prestation: prestationReq,
            numberHoraire: numberHoraireReq,
            priceHoraire: priceHoraireReq,
            TVARate: TVARateReq,
            totalHT: `${parseFloat(numberHoraireReq)*parseFloat(priceHoraireReq)}`,
            totalTTC: `${(parseFloat(numberHoraireReq)*parseFloat(priceHoraireReq) + parseFloat(numberHoraireReq)*parseFloat(priceHoraireReq)*(parseFloat(TVARateReq)/100.0))}`
        };

        let data = JSON.stringify(invoice, null, 2);

        let currentTotal = fs.readFileSync('invoices/total.log', 'UTF-8');
        let newTotal = currentTotal + `${(parseFloat(numberHoraireReq)*parseFloat(priceHoraireReq) + parseFloat(numberHoraireReq)*parseFloat(priceHoraireReq)*(parseFloat(TVARateReq)/100.0))}`
        fs.writeFileSync('invoices/total.log'), newTotal, (err) => {  
            if (err) console.log(err);
            console.log('Data written to LOG file');
        };

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

    function createBDDInvoice(currentInvoiceNumber, numberHoraireReq, priceHoraireReq, TVARateReq, res){
        let invoice = new Invoice(
            {
                invoiceNumber : createInvoiceName(currentInvoiceNumber),
                totalTTC : (parseFloat(numberHoraireReq)*parseFloat(priceHoraireReq) + parseFloat(numberHoraireReq)*parseFloat(priceHoraireReq)*(parseFloat(TVARateReq)/100.0))
            }
        );
        invoice.save ((err) => {
            if(err){
                console.log(err);
            }else{
                console.log('Invoice BDD created :');
            }
            
        });
        res.send(`Invoice n${currentInvoiceNumber} created !\n\n${invoice}`);
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




