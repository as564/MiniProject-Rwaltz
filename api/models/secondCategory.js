const mongoose = require('mongoose');

const schema = mongoose.Schema({

    'productType': { type: String, required: true },
    'productName': { type: String, required: true },
    'visibilityStatus': { type: String, required:true }
    
});

module.exports = mongoose.model('Secondcategory',schema);