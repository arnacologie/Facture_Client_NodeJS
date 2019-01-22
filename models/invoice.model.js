const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let InvoiceSchema = new Schema({
    invoiceNumber: String,
    totalTTC: Number,
});

module.exports = mongoose.model('Invoice', InvoiceSchema);

// InvoiceSchema.method({
//     calculateTaxe: function () {
        
//         let calculatedTaxe = this.priceHT + (this.priceHT * this.TVARate / 100);
//         let resultText = `The invoice '${this.name}' is worth ${calculatedTaxe}€ TTC ! <br><br><br>PrixHT(${this.priceHT}€) + ( PrixHT(${this.priceHT}€) * (TVARate(${this.TVARate})/100) ) = ${calculatedTaxe}€`;
//         priceTTCtoLog(resultText);
//         return resultText;
//     }
// });

// function priceTTCtoLog(priceTTCText){
//     priceTTCText = priceTTCText.replace("<br><br><br>", "\n\n");
//     priceTTCText += `\n\n${new Date()}\n\n`;
//     fs.appendFile('./assets/log.txt', priceTTCText, (error) => {
//         if(error){
//             console.log(error)
//         }else {
//             console.log('file edited');
//         }
//     });
// }





