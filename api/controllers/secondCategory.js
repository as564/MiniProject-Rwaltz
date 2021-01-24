const Secondcategory = require('../models/secondCategory');
const Joi = require('joi');
const appConfig = require('../../config');

/*  Possible Routes  */

const RequestUrl = function () {
    return {
        'list': {
            "url": appConfig.baseUrl + 'secondcategories',
            "method": "GET",
        },
        'details': {
            "url": appConfig.baseUrl + 'secondcategories',
            "method": "GET",
        },
        'create': {
            "url": appConfig.baseUrl + 'secondcategories',
            "method": "POST",
        }
    };
};

let Controller = {};

Controller.listing = (request, response) => {
    Secondcategory.find()
        .exec()
        .then((data) => {
            let preparedData = data.map((tmpData) => {

                /* Add Id to Url  */
                let tmpRequestData = new RequestUrl();
                tmpRequestData.details.url = tmpRequestData.details.url + '/' + tmpData._id;

                return {
                    _id: tmpData._id,
                    productType: tmpData.productType,
                    productName: tmpData.productName,
                    visibilityStatus: tmpData.visibilityStatus,
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

    Secondcategory.findOne({
        _id: request.params.secondCategoryId
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
                productName: data.productName,
                visibilityStatus: data.visibilityStatus,
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

    const schema = Joi.object({
        productType: Joi.string().required(),
        productName: Joi.string().required(),
        visibilityStatus: Joi.string().required()
    });
    const validate = schema.validate(request.body, {
        productType: Joi.string().required(),
        productName: Joi.string().required(),
        visibilityStatus: Joi.string().required()
    });
    if (validate.error) {
        return response.status(500).json({
            'message': validate.error.details[0].message
        });
    }


    /*  Check Duplication  */
    Secondcategory.findOne({
        productName: request.body.productName,
    })
        .then((data) => {
            return new Promise((resolve, reject) => {
                if (data) {
                    const error = new Error("Product Already Exists");
                    error.status = 500;
                    reject(error);
                } else {
                    resolve();
                }
            });
        })
        .then(() => {
            /* Create New Product */
            const secondCategory = new Secondcategory({
                productType: request.body.productType,
                productName: request.body.productName,
                visibilityStatus: request.body.visibilityStatus

            });


            secondCategory.save()
                .then((data) => {
                    /* Add New Product  */
                    let tmpRequestData = new RequestUrl();
                    tmpRequestData.details.url = tmpRequestData.details.url + '/' + secondCategory._id;

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

    const schema = Joi.object({
        productType: Joi.string().required(),
        productName: Joi.string().required(),
        visibilityStatus: Joi.string().required()
    });
    const validate = schema.validate(request.body, {
        productType: Joi.string().required(),
        productName: Joi.string().required(),
        visibilityStatus: Joi.string().required()
    });
    if (validate.error) {
        return response.status(500).json({
            'message': validate.error.details[0].message
        });
    }



    /* Update Category */
    Secondcategory.update(
        { _id: request.params.secondCategoryId },
        {
            productType: request.body.productType,
            productName: request.body.productName,
            visibilityStatus: request.body.visibilityStatus
        },
        { overwrite: true },
        (err) => {
            if (!err) {
                response.send("Successfully updated")
            }
        }

    )
};

Controller.delete = (request, response) => {

    Secondcategory.findOne({
        _id: request.params.secondCategoryId
    })
        .exec()
        .then((result) => {
            return new Promise((resolve, reject) => {
                if (result) {
                    resolve(result);
                } else {
                    reject({
                        message: 'Product does not exists'
                    });
                }
            });
        })
        .then((result) => {

            Secondcategory.deleteOne({
                _id: request.params.secondCategoryId
            })
                .exec()
                .then((data) => {

                    return response
                        .status(200)
                        .json({
                            message: "Product Deleted Succesfuly",
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