module.exports = (app) => {
    
        const fs = require('fs');
        const apiPath = '/api/v1';
        const noteController = require('../controllers/note.controller.js');
    
        //create
        app.get(`${apiPath}/note`, (req, res)=>{
            let createFile = fs.readFileSync('./html/createNote.html', 'UTF-8');
            res.send(createFile);
        });
        app.post(`${apiPath}/createNote`, noteController.createNote);
        
        //delete
        app.get(`${apiPath}/deletenote`, (req, res)=>{
            let createFile = fs.readFileSync('./html/deleteNote.html', 'UTF-8');
            res.send(createFile);
        });
        app.post(`${apiPath}/delNote`, noteController.deleteNote);
        
        //show
        app.get(`${apiPath}/showNote`, (req, res)=>{
            let createFile = fs.readFileSync('./html/showNote.html', 'UTF-8');
            res.send(createFile);
        });
        app.post(`${apiPath}/showNote`, noteController.showNote);
        

}