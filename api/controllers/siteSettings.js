const Sitesetting = require('../models/siteSettings');
const Joi = require('joi');
const Config = require('../../config');

/*  Possible Routes  */

const RequestUrl = function () {
    return {
        'list': {
            "url": Config.baseUrl + 'site-settings',
            "method": "GET",
        },
        'details': {
            "url": Config.baseUrl + 'site-settings',
            "method": "GET",
        },
        'create': {
            "url": Config.baseUrl + 'site-settings',
            "method": "POST",
        },
        'update': {
            "url": Config.baseUrl + 'site-settings',
            "method": "PUT",
        }
    };
};

let Controller = {};

Controller.listing = (request, response) => {
    Sitesetting.find()
        .exec()
        .then((data) => {
            let preparedData = data.map((tmpData) => {

                /* Add Id to Url  */
                let tmpRequestData = new RequestUrl();
                tmpRequestData.details.url = tmpRequestData.details.url + '/' + tmpData._id;

                return {
                    _id: tmpData._id,
                    metaDescription: tmpData.metaDescription,
                    metaKeywords: tmpData.metaKeywords,
                    socialSharingSiteName: tmpData.socialSharingSiteName,
                    socialSharingMetaTitle: tmpData.socialSharingMetaTitle,
                    socialSharingMetaDescription: tmpData.socialSharingMetaDescription,
                    buyandSellCommodities: tmpData.buyandSellCommodities,
                    email: tmpData.email,
                    twitterUrl: tmpData.twitterUrl,
                    youtubeUrl: tmpData.youtubeUrl,
                    telegramUrl: tmpData.telegramUrl,
                    siteStatus: tmpData.siteStatus,
                    address: tmpData.address,
                    contactNumber: tmpData.contactNumber,
                    websiteName: tmpData.websiteName,
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

Controller.store = (request, response) => {
    const schema = Joi.object({ 
                                metaDescription : Joi.string().required(),
                                metaKeywords: Joi.string().required(),
                                socialSharingSiteName: Joi.string().required(),
                                socialSharingMetaTitle: Joi.string().required(),
                                socialSharingMetaDescription: Joi.string().required(),
                                buyandSellCommodities: Joi.string().required(),
                                email: Joi.string() .email() .required(),
                                twitterUrl: Joi.string().required(),
                                youtubeUrl: Joi.string().required(),
                                telegramUrl: Joi.string().required(),
                                siteStatus: Joi.string().required(),
                                address: Joi.string().required(),
                                contactNumber: Joi.string().required(),
                                websiteName: Joi.string().required()  });
    const validate = schema.validate(request.body, {
                                
                                metaDescription: Joi.string().required(),
                                metaKeywords: Joi.string().required(),
                                socialSharingSiteName: Joi.string().required(),
                                socialSharingMetaTitle: Joi.string().required(),
                                socialSharingMetaDescription: Joi.string().required(),
                                buyandSellCommodities: Joi.string().required(),
                                email: Joi.string() .email() .required(),
                                twitterUrl: Joi.string().required(),
                                youtubeUrl: Joi.string().required(),
                                telegramUrl: Joi.string().required(),
                                siteStatus: Joi.string().required(),
                                address: Joi.string().required(),
                                contactNumber: Joi.string().required(),
                                websiteName: Joi.string().required()
    });

    if (validate.error) {
        return response.status(500).json({
            'message': validate.error.details[0].message
        });
    }

    /*  Check Duplication  */
    Sitesetting.findOne({
        //name: request.body.name,
    })
        // .then((data) => {
        //     return new Promise((resolve, reject) => {
        //         if (data) {
        //             const error = new Error("Role Already Exists");
        //             error.status = 500;

        //             reject(error);
        //         } else {
        //             resolve();
        //         }
        //     });
        // })
        .then(() => {

            /* Create New Role */
            const siteSettings = new Sitesetting({
                    
                    metaDescription: request.body.metaDescription,
                    metaKeywords: request.body.metaKeywords,
                    socialSharingSiteName: request.body.socialSharingSiteName,
                    socialSharingMetaTitle: request.body.socialSharingMetaTitle,
                    socialSharingMetaDescription: request.body.socialSharingMetaDescription,
                    buyandSellCommodities: request.body.buyandSellCommodities,
                    email: request.body.email,
                    twitterUrl: request.body.twitterUrl,
                    youtubeUrl: request.body.youtubeUrl,
                    telegramUrl: request.body.telegramUrl,
                    siteStatus: request.body.siteStatus,
                    address: request.body.address,
                    contactNumber: request.body.contactNumber,
                    websiteName: request.body.websiteName,
            });

            return siteSettings.save()
                .then((data) => {
                    /* Add  Id to Url  */
                    let tmpRequestData = new RequestUrl();
                    tmpRequestData.details.url = tmpRequestData.details.url + '/' + siteSettings._id;

                    return response
                        .status(201)
                        .json({
                            message: "site settings Created Succesfuly",
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

    const schema = Joi.object({ 
        metaDescription: Joi.string().required(),
        metaKeywords: Joi.string().required(),
        socialSharingSiteName: Joi.string().required(),
        socialSharingMetaTitle: Joi.string().required(),
        socialSharingMetaDescription: Joi.string().required(),
        buyandSellCommodities: Joi.string().required(),
        email: Joi.string() .email() .required(),
        twitterUrl: Joi.string().required(),
        youtubeUrl: Joi.string().required(),
        telegramUrl: Joi.string().required(),
        siteStatus: Joi.string().required(),
        address: Joi.string().required(),
        contactNumber: Joi.string().required(),
        websiteName: Joi.string().required()  });
const validate = schema.validate(request.body, {
        
        metaDescription: Joi.string().required(),
        metaKeywords: Joi.string().required(),
        socialSharingSiteName: Joi.string().required(),
        socialSharingMetaTitle: Joi.string().required(),
        socialSharingMetaDescription: Joi.string().required(),
        buyandSellCommodities: Joi.string().required(),
        email: Joi.string() .email() .required(),
        twitterUrl: Joi.string().required(),
        youtubeUrl: Joi.string().required(),
        telegramUrl: Joi.string().required(),
        siteStatus: Joi.string().required(),
        address: Joi.string().required(),
        contactNumber: Joi.string().required(),
        websiteName: Joi.string().required()
});

if (validate.error) {
return response.status(500).json({
'message': validate.error.details[0].message
});
}

    /*  Check Duplication  */
    // Sitesettings.findOne({
    //     email: request.body.email,
    //     _id: {
    //         $ne: request.params.siteSettingId
    //     }
    // })
    //     .then((data) => {
    //         return new Promise((resolve, reject) => {
    //             if (data) {
    //                 const error = new Error("User with same Email Already Exists");
    //                 error.status = 500;

    //                 reject(error);
    //             } else {
    //                 resolve();
    //             }
    //         });

    //     })
    //     .then(() => {
    //         /* Update User */
    //         let siteSetting = {};
    //         for (let tmp in request.body) {
    //             siteSetting[tmp] = request.body[tmp];
    //         }

            

    //         let updateCriteria = { _id: request.params.siteSettingId };
    //         let updateData = { $set: siteSetting };


    //         Sitesettings.update(updateCriteria, updateData)
    //             .exec()
    //             .then((data) => {

    //                 let tmpRequestData = new RequestUrl();
    //                 tmpRequestData.details.url = tmpRequestData.details.url + '/' + data._id;

    //                 return response
    //                     .status(200)
    //                     .json({
    //                         message: "Site Settings Updated Succesfuly",
    //                         requests: [{
    //                             'details': tmpRequestData.details
    //                         }]
    //                     });
    //             });
    //     })
    //     .catch((error) => {
    //         return response
    //             .status(error.status || 500)
    //             .json({
    //                 message: error.message
    //             });
    //     });

    Sitesetting.update(
        {   _id: request.params.siteSettingId},
        {  
            metaDescription: request.body.metaDescription,
            metaKeywords: request.body.metaKeywords,
            socialSharingSiteName: request.body.socialSharingSiteName,
            socialSharingMetaTitle: request.body.socialSharingMetaTitle,
            socialSharingMetaDescription: request.body.socialSharingMetaDescription,
            buyandSellCommodities: request.body.buyandSellCommodities,
            email: request.body.email,
            twitterUrl: request.body.twitterUrl,
            youtubeUrl: request.body.youtubeUrl,
            telegramUrl: request.body.twitterUrl,
            siteStatus: request.body.siteStatus,
            address: request.body.address,
            contactNumber: request.body.contactNumber,
            websiteName: request.body.websiteName
        },
            {overwrite: true},
            (err)=>{
                if(!err){
                    response.send("Successfully updated")
                }
            }

    )
};

module.exports = Controller;

