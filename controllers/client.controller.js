const Client = require('../models/client.model');
const fs = require('fs');

exports.createClient = function(req, res){

    let client = new Client(
        {
            clientName : req.body.clientName,
            address : req.body.address,
            cp : req.body.cp,
            town : req.body.town,
            referent : req.body.referent,
            phone : req.body.phone,
            mail : req.body.mail,
            prospect: req.body.prospect
        }
    );
    client.save((err) => {
        if(err){
            console.log(err);
        }else{
            console.log('Client created :');
        }
        res.send(`Client created ! \n\n${client}`);
    })

}