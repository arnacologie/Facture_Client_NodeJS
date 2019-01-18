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



exports.getInvoices = function(req, res){
    Invoice.find(function(err, invoice){
        if(err){
            console.log(err);
        }
        res.send(invoice);
    });
}

exports.findInvoice = function(req, res){
    let id = req.params.id;
    Invoice.findById(id, function(err, invoice){
        if(err){
            console.log(err);
        }
        res.send(invoice);
    });
}

exports.deleteInvoice = function(req, res){
    let id = req.params.id;
    Invoice.findByIdAndDelete(id, function(err, invoice){
        if(err){
            console.log(err);
        }
        res.send("HAS BEEN DELETED : "+invoice)
    });
}

exports.updateInvoice = function(req, res){
    let id = req.params.id;
    Invoice.findByIdAndUpdate(id, req.body, function(err){
        if(err){
            console.log(err);
        }
        Invoice.findById(id, function(err, invoice){
            if(err){
                console.log(err);
            }
            res.send(invoice);
        });
    });
}

//change priceHT (given w/JSON) of the invoices w/ description (given w/JSON)
exports.updateInvoices = function(req, res){
    Invoice.updateMany({description: req.body.description}, {$set : {"priceHT" : req.body.priceHT}}, function(err){
        if(err){
            console.log(err);
        }
        //res.redirect('/api/v1/invoices/read');
        res.send("Updated");
        
    });
}

exports.deleteInvoicesGet = function(req, res){
    let deleteManyFile = fs.readFileSync('./html/deleteMany.html', 'UTF-8');
    //replace to fill the placeholder
    Invoice.find(function(err, invoices){
        if(err){
            console.log(err);
        }
        //console.log(invoices[0].name);
        deleteManyFile = mergeValues(invoices, deleteManyFile);
        res.send(deleteManyFile);
    });
    //console.log(deleteManyFile);
}

exports.deleteInvoicesPost = function(req, res){
   Invoice.deleteMany({_id: {$in: req.body.IDToDelete} }, function(err) {
       if(err){
           console.log(err);
       }
       res.redirect('/api/v1/invoices/delete');
       console.log(req.body.IDToDelete);
   })
}

exports.calculateTaxe = function (req, res){
    let id = req.params.id;
    Invoice.findById(id, function(err, invoice){
        if(err){
            console.log(err);
        }this.priceHT + (this.priceHT * this.TVARate / 100)
        res.send(invoice.calculateTaxe());
    });
}

//----------------------------FUNCTIONS-----------------------------------------/


function mergeValues(invoices, content){
    content = content.replace("{{placeholder}}", jsonToTable(invoices));
    return content;
}

function jsonToTable(json){
    let table = ''
    let result = '';
    for(let i = 0; i<json.length; i++){
        if(i == 0){
            table = `<table style="width:100%;text-align:center"><tr><th></th><th>ID</th><th>Reference</th><th>Name</th><th>Description</th><th>PriceHT</th><th>TVARate</th><th>Version</th></tr><tr><td><input id="IDToDelete"type="checkbox"name="IDToDelete"value="${json[i].id}"></td><td>${json[i].id}</td><td>${json[i].reference}</td><td>${json[i].name}</td><td>${json[i].description}</td><td>${json[i].priceHT}</td><td>${json[i].TVARate}</td><td>${json[i].__v}</td></tr>`;
            result+=table;
        }else{
            table = `<tr><td><input id="IDToDelete"type="checkbox"name="IDToDelete"value="${json[i].id}"></td><td>${json[i].id}</td><td>${json[i].reference}</td><td>${json[i].name}</td><td>${json[i].description}</td><td>${json[i].priceHT}</td><td>${json[i].TVARate}</td><td>${json[i].__v}</td></tr>`
            result+=table;
        }
    }
    result+='</table>';
    return result;
}