const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ClientSchema = new Schema({
    clientName : String,
    address : String,
    cp : Number,
    town : String,
    referent : String,
    phone : String,
    mail : String,
    prospect: Boolean
});

module.exports = mongoose.model('Client', ClientSchema);