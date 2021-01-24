const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const logger = require('morgan');
const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true)

const config = require('./config');

const connection = config.dbConfig.connection;

const roleModule = config.routeSlug.roles;
const userModule = config.routeSlug.users;
const firstCategoryModule = config.routeSlug.firstcategories;
const secondCategoryModule = config.routeSlug.secondcategories;
const emailTemplateModule = config.routeSlug.emailtemplates;
const sliderImagesModule = config.routeSlug.sliderimages;
const siteSettingsModule = config.routeSlug.siteSettings;

const app = express();

//  Mongoose Connect 
mongoose.connect(connection, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(cors());

app.use(logger('dev'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Routes
const roleRoutes = require('./api/routes/role');
const userRoutes = require('./api/routes/user');
const firstCategoryRoutes = require('./api/routes/firstCategory');
const secondCategoryRoutes = require('./api/routes/secondCategory');
const emailTemplateRoutes = require('./api/routes/emailTemplate');
const sliderImagesRoutes = require('./api/routes/sliderImages');
const siteSettingsRoutes = require('./api/routes/siteSettings');



app.use("/" + roleModule, roleRoutes);
app.use("/" + userModule, userRoutes);
app.use("/" + firstCategoryModule, firstCategoryRoutes);
app.use("/" + secondCategoryModule, secondCategoryRoutes);
app.use("/" + emailTemplateModule, emailTemplateRoutes);
app.use("/" + sliderImagesModule, sliderImagesRoutes);
app.use("/" + siteSettingsModule, siteSettingsRoutes);


/*  Handling 404  */
app.use((request, response, next) => {
    const error = new Error("Not Found");
    error.status = "404";
    next(error);
})

/*  Handling Error or 500  */
app.use((error, request, response, next) => {

    const status = error.status || 500;

    return response.status(status)
        .json({
            error: {
                message: error.message
            }
        });
});

module.exports = app;