const Invoice = require('../models/invoice.model');
const fs = require('fs');

exports.createInvoice = function(req, res){
    //console.log(req.body);
    let currentInvoiceNumber;

    Invoice.findOne().sort({created_at: -1}).exec(function(err, lastInvoice) {
        if(err){
            console.log(err);
        }
        if(lastInvoice != null)
            currentInvoiceNumber = lastInvoice.invoiceNumber+1;
        else
            currentInvoiceNumber = 0;

        console.log(`invoice number = ${currentInvoiceNumber}`);
        res.send(`invoice number = ${currentInvoiceNumber}`);

        if(fs.existsSync('invoices/foo')){
            console.log('repo exists');
        }
        else{
            fs.mkdir('invoices/foo', { recursive: true }, (err) => {
                console.log('repo created');
            })
        }

        fs.writeFileSync(`./invoices/foo/F000${currentInvoiceNumber}.extension`, 'test', (error) => {
            if(error){
                console.log(error)
            }else {
                console.log('file edited');
            }
        });
    });

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



