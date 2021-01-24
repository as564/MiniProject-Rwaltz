const mongoose = require('mongoose');

let schemaFields = {
    'imageUrl': { type: String, required: true ,unique:true},
};

let schemaOptions = {
    timestamp:true
}

const schema = mongoose.Schema(schemaFields, schemaOptions);

module.exports = mongoose.model('Sliderimage',schema);