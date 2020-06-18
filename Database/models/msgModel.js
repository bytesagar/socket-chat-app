var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Mes = new Schema({
    content: String
});

module.exports = mongoose.model('Mes', Mes);