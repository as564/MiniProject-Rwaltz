const mongoose = require('mongoose');


/* const schema = mongoose.Schema({

    'name': { type: String, required: true},
    'email': { type: String, required:true, unique: true },
    'mobileNo': { type: String, required:true, unique: true },
    'avgRating': { type: Number, required:true },
    'status': { type: String, required:true }
    
}); */
let schemaFields = {
    'name': { type: String, required: true},
    'email': { type: String, required:true, unique: true },
    'mobileNo': { type: String, required:true, unique: true },
    'avgRating': { type: Number, required:true },
    'status': { type: String, required:true }
};

let schemaOptions = {
    timestamp:true
}
const schema = mongoose.Schema(schemaFields, schemaOptions);
module.exports = mongoose.model('User',schema);



