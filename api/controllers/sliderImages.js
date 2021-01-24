const Sliderimage = require('../models/sliderImages');
const Joi = require('joi');
const config = require('../../config');

/*  Possible Routes  */

const RequestUrl = function () {
    return {
        'list': {
            "url": config.baseUrl + 'sliderimages',
            "method": "GET",
        },
        'details': {
            "url": config.baseUrl + 'sliderimages',
            "method": "GET",
        },
        'create': {
            "url": config.baseUrl + 'sliderimages',
            "method": "POST",
        },
        'update': {
            "url": config.baseUrl + 'sliderimages',
            "method": "PUT",
        },
        'delete': {
            "url": config.baseUrl + 'sliderimages',
            "method": "DELETE",
        },

    };
};


let Controller = {};

Controller.listing = (request, response) => {
    Sliderimage.find()
        .exec()
        .then((data) => {
            let preparedData = data.map((tmpData) => {

                /* Add Id to Url  */
                let tmpRequestData = new RequestUrl();
                tmpRequestData.details.url = tmpRequestData.details.url + '/' + tmpData._id;

                return {
                    _id: tmpData._id,
                    imageUrl: tmpData.imageUrl,
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
            return response.status(500).json({
                'error': error.message
            });
        });

};

Controller.getDetails = (request, response) => {
    Sliderimage.findOne({
        _id: request.params.sliderImageId
    })
        .exec()
        .then((data) => {
            if (!data) {
                return response.status(500).json({
                    'message': 'Image Url Not Found'
                });
            }

            let tmpRequestData = new RequestUrl();
            tmpRequestData.delete.url = tmpRequestData.delete.url + '/' + data._id;
            tmpRequestData.update.url = tmpRequestData.update.url + '/' + data._id;

            delete tmpRequestData.details;
            delete tmpRequestData.create;

            let responseData = {
                _id: data._id,
                imageUrl: data.imageUrl,
                requests: tmpRequestData
            };

            return response.status(200).json(responseData);
        })
        .catch((error) => {
            return response.status(500).json({
                'error': error.message
            });
        });

};

Controller.store = (request, response) => {

    const schema = Joi.object({ imageUrl: Joi.string().required() });
    console.log(request.body);
    const validate = schema.validate(request.body, {
        imageUrl: Joi.string().required(),
    });

    if (validate.error) {
        return response.status(500).json({
            'message': validate.error.details[0].message
        });
    }

    /*  Check Duplication  */
    Sliderimage.findOne({
        imageUrl: request.body.imageUrl,
    })
        .then((data) => {
            return new Promise((resolve, reject) => {
                if (data) {
                    const error = new Error("Url Already Exists");
                    error.status = 500;

                    reject(error);
                } else {
                    resolve();
                }
            });
        })
        .then(() => {

            /* Create New Role */
            const sliderImage = new Sliderimage({
                imageUrl: request.body.imageUrl
            });

            return sliderImage.save()
                .then((data) => {
                    /* Add Role Id to Url  */
                    let tmpRequestData = new RequestUrl();
                    tmpRequestData.details.url = tmpRequestData.details.url + '/' + sliderImage._id;

                    return response
                        .status(201)
                        .json({
                            message: "Url saved Succesfuly",
                            requests: [{
                                'details': tmpRequestData.details
                            }]
                        });
                });
        })
        .catch((error) => {
            return response
                .status(500)
                .json({
                    message: error.message
                });
        });
};

Controller.update = (request, response) => {

    const schema = Joi.object({ imageUrl: Joi.string().required() });
    const validate = schema.validate(request.body, {
        imageUrl: Joi.string().required(),
    });

    if (validate.error) {
        return response.status(500).json({
            'message': validate.error.details[0].message
        });
    }



    /* Update Url */
    Sliderimage.update(
        { _id: request.params.sliderImageId },
        {
            imageUrl: request.body.imageUrl,

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

    Sliderimage.findOne({
        _id: request.params.sliderImageId
    })
        .exec()
        .then((result) => {
            return new Promise((resolve, reject) => {
                if (result) {
                    resolve(result);
                } else {
                    reject({
                        message: 'Url does not exists'
                    });
                }
            });
        })
        .then((result) => {

            Sliderimage.deleteOne({
                _id: request.params.sliderImageId
            })
                .exec()
                .then((data) => {
                    console.log(data);
                    return response
                        .status(200)
                        .json({
                            message: "Url Deleted Succesfuly",
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