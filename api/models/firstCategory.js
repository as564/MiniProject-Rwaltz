const mongoose = require('mongoose');

const schema = mongoose.Schema({

    'productType': { type: String, required: true },
    'status': { type: String, required:true }
    
});

module.exports = mongoose.model('Firstcategory',schema);