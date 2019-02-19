const Client = require('../models/client.model');
const fs = require('fs');

exports.createNote = function(req, res){
    console.log(req.body);

    //find the client name
    Client.findOne({clientName: req.body.clientName}, function(err, client){
            if(err){
                console.log(err);
            }
            currentClientName = client.clientName;


            if(fs.existsSync(`notes/${currentClientName}`)){
                console.log('repo exists');
            }
            else{
                fs.mkdir(`notes/${currentClientName}`, { recursive: true }, (err) => {
                    console.log('repo created');
                })
            }

            fs.writeFileSync(`./notes/${currentClientName}/notes.json`, req.body.note, (error) => {
                if(error){
                    console.log(error)
                }else {
                    console.log('file edited');
                }
            });
        });
    }

exports.deleteNote = function(req, res){
    //find the client name
    Client.findOne({clientName: req.body.clientName}, function(err, client){
        if(err){
            console.log(err);
        }
        currentClientName = client.clientName;


        if(fs.existsSync(`notes/${currentClientName}`)){
            console.log('repo exists');
        }
        else{
            fs.mkdir(`notes/${currentClientName}`, { recursive: true }, (err) => {
                console.log('repo created');
            })
        }

        fs.writeFileSync(`./notes/${currentClientName}/notes.json`, "", (error) => {
            if(error){
                console.log(error)
            }else {
                console.log('file edited');
            }
        });
    });
}

exports.showNote = function(req, res){
    //find the client name
    Client.findOne({clientName: req.body.clientName}, function(err, client){
        if(err){
            console.log(err);
        }
        currentClientName = client.clientName;


        if(fs.existsSync(`notes/${currentClientName}`)){
            console.log('repo exists');
        }
        else{
            fs.mkdir(`notes/${currentClientName}`, { recursive: true }, (err) => {
                console.log('Aucun client avec ce nom');
            })
        }

        let file = fs.readFileSync(`./notes/${currentClientName}/notes.json`, 'UTF-8');

        console.log(file);
    });
}


// //find the client with the clientName for the facture
// Client.findOne({clientName: req.body.clientName}, function(err, client){
//     if(err){
//         console.log(err);
//     }
//     currentClientName = client.clientName;
//     currentAddress = client.address;
//     currentCP = client.cp;
//     currentTown = client.town;

//     if(fs.existsSync(`notes/${currentClientName}`)){
//         console.log('repo exists');
//     }
//     else{
//         fs.mkdir(`notes/${currentClientName}`, { recursive: true }, (err) => {
//             console.log('repo created');
//         })
//     }

//     fs.writeFileSync(`./notes/${currentClientName}/F000${currentInvoiceNumber}.extension`, 'test', (error) => {
//         if(error){
//             console.log(error)
//         }else {
//             console.log('file edited');
//         }
//     });
// });