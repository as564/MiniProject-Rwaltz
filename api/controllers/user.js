const User = require('../models/user');
const Joi = require('joi');
const appConfig = require('../../config');

/*  Possible Routes  */

const RequestUrl = function () {
    return {
        'list': {
            "url": appConfig.baseUrl + 'users',
            "method": "GET",
        },
        'details': {
            "url": appConfig.baseUrl + 'users',
            "method": "GET",
        },
        'create': {
            "url": appConfig.baseUrl + 'users',
            "method": "POST",
        }
    };
};

let Controller = {};

Controller.listing = (request, response) => {
    User.find()
        .exec()
        .then((data) => {
            let preparedData = data.map((tmpData) => {

                /* Add User Id to Url  */
                let tmpRequestData = new RequestUrl();
                tmpRequestData.details.url = tmpRequestData.details.url + '/' + tmpData._id;

                return {
                    _id: tmpData._id,
                    name: tmpData.name,
                    email: tmpData.email,
                    mobileNo: tmpData.mobileNo,
                    avgRating: tmpData.avgRating,
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
   // console.log(request.params.userId);
    User.findOne({
        _id: request.params.userId
    })
        .exec()
        .then((data) => {
            if (!data) {
                return response.status(500).json({
                    'message': 'User Not Found'
                });
            }

            /* let tmpRequestData = new RequestUrl();
            tmpRequestData.delete.url = tmpRequestData.delete.url + '/' + data._id;
            tmpRequestData.update.url = tmpRequestData.update.url + '/' + data._id;

            delete tmpRequestData.details;
            delete tmpRequestData.create; */

            let responseData = {
                _id: data._id,
                name: data.name,
                email: data.email,
                mobileNo: data.mobileNo,
                avgRating: data.avgRating,
                status: data.status,
                //requests: tmpRequestData
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
    
    const schema = Joi.object({ name: Joi.string().min(2).required(),
                                email: Joi.string().email().required(),
                                mobileNo: Joi.string().min(10).required(),
                                avgRating: Joi.number().required(),
                                status: Joi.string().required() });
                                
    const validate = schema.validate(request.body, {
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        mobileNo: Joi.string().min(10).required(),
        avgRating: Joi.number().required(),
        status: Joi.string().required()
    });
    
    
    if (validate.error) {
console.log('pramod',validate.error);
        return response.status(500).json({
            'message': validate.error.details[0].message
        });
    }

    console.log(validate.error);
    
    /*  Check Duplication  */
    User.findOne({
        email: request.query.email,
    })
        .then((data) => {
            return new Promise((resolve, reject) => {
                if (data) {
                    const error = new Error("User Already Exists");
                    error.status = 500;
                    reject(error);
                } else {
                    resolve();
                }
            });
        })
        .then(() => {
            /* Create New Role */
            const user = new User({
                name: request.body.name,
                email: request.body.email,
                mobileNo: request.body.mobileNo,
                avgRating: request.body.avgRating,
                status: request.body.status
                
            });


            user.save()
                .then((data) => {
                    /* Add User Id to Url  */
                    let tmpRequestData = new RequestUrl();
                    tmpRequestData.details.url = tmpRequestData.details.url + '/' + user._id;

                    return response
                        .status(201)
                        .json({
                            message: "User Created Succesfuly",
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

     const schema = Joi.object({ name: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        mobileNo: Joi.string().min(10).required(),
        avgRating: Joi.number().required(),
        status: Joi.string().required() });
        
const validate = schema.validate(request.body, {
name: Joi.string().required(),
email: Joi.string().email().required(),
mobileNo: Joi.string().min(10).required(),
avgRating: Joi.number().required(),
status: Joi.string().required()
});


if (validate.error) {

return response.status(500).json({
'message': validate.error.details[0].message
});
}

    

            /* Update User */
            User.update(
            {   _id: request.params.userId},
            {  
                name: request.body.name,
                email: request.body.email,
                mobileNo: request.body.mobileNo,
                avgRating: request.body.avgRating,
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

    User.findOne({
        _id: request.params.userId
    })
    .exec()
    .then((result) => {
        return new Promise((resolve, reject) => {
            if (result) {
                resolve(result);
            } else {
                reject({
                    message: 'User does not exists'
                });
            }
        });
    })
    .then((result) => {
        
        User.deleteOne({
            _id: request.params.userId
        })
        .exec()
        .then((data) => {
            console.log(data);
            return response
                .status(200)
                .json({
                    message: "User Deleted Succesfuly",
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