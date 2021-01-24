const Emailtemplate = require('../models/emailTemplate');
const Joi = require('joi');
const appConfig = require('../../config');

/*  Possible Routes  */

const RequestUrl = function () {
    return {
        'list': {
            "url": appConfig.baseUrl + 'emailtemplates',
            "method": "GET",
        },
        'details': {
            "url": appConfig.baseUrl + 'emailtemplates',
            "method": "GET",
        },
        'create': {
            "url": appConfig.baseUrl + 'emailtemplates',
            "method": "POST",
        }
    };
};

let Controller = {};

Controller.listing = (request, response) => {
    Emailtemplate.find()
        .exec()
        .then((data) => {
            let preparedData = data.map((tmpData) => {

                /* Add User Id to Url  */
                let tmpRequestData = new RequestUrl();
                tmpRequestData.details.url = tmpRequestData.details.url + '/' + tmpData._id;

                return {
                    _id: tmpData._id,
                    traderId: tmpData.traderId,
                    name: tmpData.name,
                    from: tmpData.from,
                    fromEmailId: tmpData.fromEmailId,
                    subject: tmpData.subject,
                    
                    requests: [{
                        'details': tmpRequestData.details
                    }]
                };
            });

            let responseData = {
                count: preparedData.length,
                data: preparedData
            };

            return response.status(200).json(responseData);
        })
        .catch((error) => {
            return response.status(error.status || 500).json({
                'error': error.message
            });
        });

};


Controller.getDetails = (request, response) => {

    Emailtemplate.findOne({
        _id: request.params.userId
    })
        .exec()
        .then((data) => {
            if (!data) {
                return response.status(500).json({
                    'message': 'Email template Not Found'
                });
            }

            let tmpRequestData = new RequestUrl();
            tmpRequestData.delete.url = tmpRequestData.delete.url + '/' + data._id;
            tmpRequestData.update.url = tmpRequestData.update.url + '/' + data._id;

            delete tmpRequestData.details;
            delete tmpRequestData.create;

            let responseData = {
                _id: data._id,
                traderId: data.traderId,
                name: data.name,
                from: data.from,
                fromEmailId: data.fromEmailId,
                subject: data.subject,
                
                requests: tmpRequestData
            };

            return response.status(200).json(responseData);
        })
        .catch((error) => {
            return response.status(error.status || 500).json({
                'error': error.message
            });
        });

};

Controller.store = (request, response) => {

    const schema = Joi.object({ traderId: Joi.string() .required(),
                                name: Joi.string() .min(3) .required(),
                                from: Joi.string() .required(),
                                fromEmailId: Joi.string() .email() .required(),
                                subject: Joi.string() .required()
                                 });
    const validate = schema.validate(request.body, {
        traderId: Joi.string() .required(),
        name: Joi.string(). min(3) .required(),
        from: Joi.string() .required(),
        fromEmailId: Joi.string() .email() .required(),
        subject: Joi.string() .required()
        
    });
    if (validate.error) {
        return response.status(500).json({
            'message': validate.error.details[0].message
        });
    }


    /*  Check Duplication  */
    Emailtemplate.findOne({
        traderId: request.body.traderId,
    })
        .then((data) => {
            return new Promise((resolve, reject) => {
                if (data) {
                    const error = new Error("Trader Already Exists");
                    error.status = 500;
                    reject(error);
                } else {
                    resolve();
                }
            });
        })
        .then(() => {
            /* Create New Trader */
            const emailTemplate = new Emailtemplate({
                traderId: request.body.traderId,
                name: request.body.name,
                from: request.body.from,
                fromEmailId: request.body.fromEmailId,
                subject: request.body.subject
                
                
            });


            emailTemplate.save()
                .then((data) => {
                    /* Add  Id to Url  */
                    let tmpRequestData = new RequestUrl();
                    tmpRequestData.details.url = tmpRequestData.details.url + '/' + emailTemplate._id;

                    return response
                        .status(201)
                        .json({
                            message: "Email Template created Succesfully",
                            requests: [{
                                'details': tmpRequestData.create
                            }]
                        });
                });

        })
        .catch((error) => {
            return response
                .status(error.status || 500)
                .json({
                    message: error.message
                });
        });
};

Controller.update = (request, response) => {

    const schema = Joi.object({ traderId: Joi.string() .required(),
        name: Joi.string() .min(3) .required(),
        from: Joi.string() .required(),
        fromEmailId: Joi.string() .email() .required(),
        subject: Joi.string() .required()
         });
const validate = schema.validate(request.body, {
traderId: Joi.string() .required(),
name: Joi.string(). min(3) .required(),
from: Joi.string() .required(),
fromEmailId: Joi.string() .email() .required(),
subject: Joi.string() .required()

});
if (validate.error) {
return response.status(500).json({
'message': validate.error.details[0].message
});
}

   

           /* Update User */
           Emailtemplate.update(
           {   _id: request.params.emailTemplateId},
           {  
               traderId: request.body.traderId,
                name: request.body.name,
                from: request.body.from,
                fromEmailId: request.body.fromEmailId,
                subject: request.body.subject },
               {overwrite: true},
               (err)=>{
                   if(!err){
                       response.send("Successfully updated")
                   }
               }

       )
};

Controller.delete = (request, response) => {

    Emailtemplate.findOne({
        _id: request.params.emailTemplateId
    })
    .exec()
    .then((result) => {
        return new Promise((resolve, reject) => {
            if (result) {
                resolve(result);
            } else {
                reject({
                    message: 'Email Template does not exists'
                });
            }
        });
    })
    .then((result) => {
        
        Emailtemplate.deleteOne({
            _id: request.params.emailTemplateId
        })
        .exec()
        .then((data) => {
            console.log(data);
            return response
                .status(200)
                .json({
                    message: "Email Template Deleted Succesfuly",
                    requests: []
                });
        })
        .catch((error) => {

            return response
                .status(500)
                .json({
                    message: error.message
                });
                
        });
    })
    .catch(err => {
        response.status(500)
            .json({
                error: err
            });
    }); 


};

module.exports = Controller;