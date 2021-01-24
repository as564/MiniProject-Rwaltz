const mongoose = require('mongoose');

let siteSettingsSchema = {
    metaDescription: String,
    metaKeywords: String,
    socialSharingSiteName: String,
    socialSharingMetaTitle: String,
    socialSharingMetaDescription: String,
    buyandSellCommodities: String,
    email: String,
    twitterUrl: String,
    youtubeUrl: String,
    telegramUrl: String,
    siteStatus: String,
    address: String,
    contactNumber: String,
    websiteName: String
}

module.exports = mongoose.model('Sitesetting', siteSettingsSchema );

