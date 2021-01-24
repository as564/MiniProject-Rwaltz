const Firstcategory = require('../models/firstCategory');
const Joi = require('joi');
const appConfig = require('../../config');

/*  Possible Routes  */

const RequestUrl = function () {
    return {
        'list': {
            "url": appConfig.baseUrl + 'firstcategories',
            "method": "GET",
        },
        'details': {
            "url": appConfig.baseUrl + 'firstcategories',
            "method": "GET",
        },
        'create': {
            "url": appConfig.baseUrl + 'firstcategories',
            "method": "POST",
        }
    };
};

let Controller = {};

Controller.listing = (request, response) => {
    Firstcategory.find()
        .exec()
        .then((data) => {
            let preparedData = data.map((tmpData) => {

                /* Add Id to Url  */
                let tmpRequestData = new RequestUrl();
                tmpRequestData.details.url = tmpRequestData.details.url + '/' + tmpData._id;

                return {
                    _id: tmpData._id,
                    productType: tmpData.productType,
                    status: tmpData.status,
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

    Firstcategory.findOne({
        _id: request.params.firstcategoryId
    })
        .exec()
        .then((data) => {
            if (!data) {
                return response.status(500).json({
                    'message': 'User Not Found'
                });
            }

            let tmpRequestData = new RequestUrl();
            tmpRequestData.delete.url = tmpRequestData.delete.url + '/' + data._id;
            tmpRequestData.update.url = tmpRequestData.update.url + '/' + data._id;

            delete tmpRequestData.details;
            delete tmpRequestData.create;

            let responseData = {
                _id: data._id,
                productType: data.productType,
                status: data.status,
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

    const schema = Joi.object({ productType: Joi.string() .required(),
                                status: Joi.string().required() });
    const validate = schema.validate(request.body, {
        productType: Joi.string().required(),
        status: Joi.string().required()
    });
    if (validate.error) {
        return response.status(500).json({
            'message': validate.error.details[0].message
        });
    }


    /*  Check Duplication  */
    Firstcategory.findOne({
        productType: request.body.productType,
    })
        .then((data) => {
            return new Promise((resolve, reject) => {
                if (data) {
                    const error = new Error("Product Type Already Exists");
                    error.status = 500;
                    reject(error);
                } else {
                    resolve();
                }
            });
        })
        .then(() => {
            /* Create New Product Type */
            const firstCategory = new Firstcategory({
                productType: request.body.productType,
                status: request.body.status
                
            });


            firstCategory.save()
                .then((data) => {
                    /* Add Id to Url  */
                    let tmpRequestData = new RequestUrl();
                    tmpRequestData.details.url = tmpRequestData.details.url + '/' + firstCategory._id;

                    return response
                        .status(201)
                        .json({
                            message: "Data Created Succesfuly",
                            requests: [{
                                'details': tmpRequestData.details
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

    const schema = Joi.object({ productType: Joi.string() .required(),
        status: Joi.string().required() });
       
        const validate = schema.validate(request.body, {
            productType: Joi.string().required(),
            status: Joi.string().required()
        });
        if (validate.error) {
            return response.status(500).json({
                'message': validate.error.details[0].message
            });
        }

   

           /* Update User */
           Firstcategory.update(
           {   _id: request.params.firstcategoryId},
           {  
               productType: request.body.productType,
               status: request.body.status },
               {overwrite: true},
               (err)=>{
                   if(!err){
                       response.send("Successfully updated")
                   }
               }

       )
};

Controller.delete = (request, response) => {

    Firstcategory.findOne({
        _id: request.params.firstcategoryId
    })
    .exec()
    .then((result) => {
        return new Promise((resolve, reject) => {
            if (result) {
                resolve(result);
            } else {
                reject({
                    message: 'Product type does not exists'
                });
            }
        });
    })
    .then((result) => {
        
        Firstcategory.deleteOne({
            _id: request.params.firstcategoryId
        })
        .exec()
        .then((data) => {

            return response
                .status(200)
                .json({
                    message: "Product type Deleted Succesfuly",
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