const Facture = require('../models/facture.model');
const fs = require('fs');

exports.createFacture = function(req, res){

    console.log(req.body)

    // let facture = new Facture(
    //     {
    //         reference: req.body.reference,
    //         name: req.body.name,
    //         description : req.body.description,
    //         priceHT : req.body.priceHT,
    //         TVARate : req.body.TVARate
    //     }
    // );
    // facture.save((err) => {
    //     if(err){
    //         console.log(err);
    //     }else{
    //         console.log('Facture created :');
    //     }
    //     res.send(facture);
    // })

    

    res.send(req.body);
}



exports.getFactures = function(req, res){
    Facture.find(function(err, facture){
        if(err){
            console.log(err);
        }
        res.send(facture);
    });
}

exports.findFacture = function(req, res){
    let id = req.params.id;
    Facture.findById(id, function(err, facture){
        if(err){
            console.log(err);
        }
        res.send(facture);
    });
}

exports.deleteFacture = function(req, res){
    let id = req.params.id;
    Facture.findByIdAndDelete(id, function(err, facture){
        if(err){
            console.log(err);
        }
        res.send("HAS BEEN DELETED : "+facture)
    });
}

exports.updateFacture = function(req, res){
    let id = req.params.id;
    Facture.findByIdAndUpdate(id, req.body, function(err){
        if(err){
            console.log(err);
        }
        Facture.findById(id, function(err, facture){
            if(err){
                console.log(err);
            }
            res.send(facture);
        });
    });
}

//change priceHT (given w/JSON) of the factures w/ description (given w/JSON)
exports.updateFactures = function(req, res){
    Facture.updateMany({description: req.body.description}, {$set : {"priceHT" : req.body.priceHT}}, function(err){
        if(err){
            console.log(err);
        }
        //res.redirect('/api/v1/factures/read');
        res.send("Updated");
        
    });
}

exports.deleteFacturesGet = function(req, res){
    let deleteManyFile = fs.readFileSync('./html/deleteMany.html', 'UTF-8');
    //replace to fill the placeholder
    Facture.find(function(err, factures){
        if(err){
            console.log(err);
        }
        //console.log(factures[0].name);
        deleteManyFile = mergeValues(factures, deleteManyFile);
        res.send(deleteManyFile);
    });
    //console.log(deleteManyFile);
}

exports.deleteFacturesPost = function(req, res){
   Facture.deleteMany({_id: {$in: req.body.IDToDelete} }, function(err) {
       if(err){
           console.log(err);
       }
       res.redirect('/api/v1/factures/delete');
       console.log(req.body.IDToDelete);
   })
}

exports.calculateTaxe = function (req, res){
    let id = req.params.id;
    Facture.findById(id, function(err, facture){
        if(err){
            console.log(err);
        }this.priceHT + (this.priceHT * this.TVARate / 100)
        res.send(facture.calculateTaxe());
    });
}

//----------------------------FUNCTIONS-----------------------------------------/


function mergeValues(factures, content){
    content = content.replace("{{placeholder}}", jsonToTable(factures));
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