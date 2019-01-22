const Client = require('../models/client.model');
const fs = require('fs');

exports.createClient = function(req, res){
    
    let prospectValue;
    if(req.body.prospect == null)
        prospectValue = 'false';
    else prospectValue = req.body.prospect;

    let client = new Client(
        {
            clientName : req.body.clientName,
            address : req.body.address,
            cp : req.body.cp,
            town : req.body.town,
            referent : req.body.referent,
            phone : req.body.phone,
            mail : req.body.mail,
            prospect: prospectValue
        }
    );
    client.save((err) => {
        if(err){
            console.log(err);
        }else{
            console.log('Client created :');
        }
        res.send(`Client created ! \n\n${client}`);
    });

}

exports.getClients = function(req, res){
    Client.find(function(err, Clients){
        if(err){
            console.log(err);
        }
        res.send(Clients);
    });
}

exports.findClient = function(req, res){
    let id = req.params.id;
    Client.findById(id, function(err, Clients){
        if(err){
            console.log(err);
        }
        res.send(Clients);
    });
}

exports.deleteClient = function(req, res){
    let id = req.params.id;
    Client.findByIdAndDelete(id, function(err, Clients){
        if(err){
            console.log(err);
        }
        res.send("HAS BEEN DELETED : "+Clients)
    });
}

exports.updateClient = function(req, res){
    let id = req.params.id;
    Client.findByIdAndUpdate(id, req.body, function(err){
        if(err){
            console.log(err);
        }
        Clients.findById(id, function(err, Clients){
            if(err){
                console.log(err);
            }
            res.send(Clients);
        });
    });
}

//change address (given w/JSON) of the client w/ clientName (given w/JSON)
exports.updateClients = function(req, res){
    Client.updateMany({clientName: req.body.clientName}, {$set : {"address" : req.body.address}}, function(err){
        if(err){
            console.log(err);
        }
        //res.redirect('/api/v1/Client/read');
        res.send("Updated");
        
    });
}

exports.deleteClientsGet = function(req, res){
    let deleteManyFile = fs.readFileSync('./html/deleteMany.html', 'UTF-8');
    //replace to fill the placeholder
    Client.find(function(err, Client){
        if(err){
            console.log(err);
        }
        //console.log(Client[0].name);
        deleteManyFile = mergeValues(Client, deleteManyFile);
        res.send(deleteManyFile);
    });
    //console.log(deleteManyFile);
}

exports.deleteClientsPost = function(req, res){
   Client.deleteMany({clientName: {$in: req.body.ClientsToDelete} }, function(err) {
       if(err){
           console.log(err);
       }
       res.redirect('/api/v1/delete');
       console.log(req.body.ClientsToDelete);
   })
}

exports.calculateTaxe = function (req, res){
    let id = req.params.id;
    Client.findById(id, function(err, Clients){
        if(err){
            console.log(err);
        }this.priceHT + (this.priceHT * this.TVARate / 100)
        res.send(Clients.calculateTaxe());
    });
}

//----------------------------FUNCTIONS-----------------------------------------/


function mergeValues(Client, content){
    content = content.replace("{{placeholder}}", jsonToTable(Client));
    return content;
}

function jsonToTable(json){
    let table = ''
    let result = '';
    for(let i = 0; i<json.length; i++){
        if(i == 0){
            table = `<table style="width:100%;text-align:center"><tr><th></th><th>Nom</th><th>Adresse</th><th>CP</th><th>Ville</th><th>Contact Referent</th><th>Tel</th><th>Mail</th><th>Prospect</th></tr><tr><td><input id="ClientsToDelete"type="checkbox"name="ClientsToDelete"value="${json[i].clientName}"></td><td>${json[i].clientName}</td><td>${json[i].address}</td><td>${json[i].cp}</td><td>${json[i].town}</td><td>${json[i].referent}</td><td>${json[i].phone}</td><td>${json[i].mail}</td><td>${json[i].prospect}</td></tr>`;
            result+=table;
        }else{
            table = `<tr><td><input id="ClientsToDelete"type="checkbox"name="ClientsToDelete"value="${json[i].clientName}"></td><td>${json[i].clientName}</td><td>${json[i].address}</td><td>${json[i].cp}</td><td>${json[i].town}</td><td>${json[i].referent}</td><td>${json[i].phone}</td><td>${json[i].mail}</td><td>${json[i].prospect}</td></tr>`
            result+=table;
        }
    }
    result+='</table>';
    return result;
}
