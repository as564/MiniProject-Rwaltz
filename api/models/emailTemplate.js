const mongoose = require('mongoose');

const schema = mongoose.Schema({

    'traderId': { type: String, required: true },
    'name': { type: String, required: true },
    'from': { type: String, required:true },
    'fromEmailId': { type: String, required:true },
    'subject': { type: String, required:true }
    
});

module.exports = mongoose.model('Emailtemplate',schema);
