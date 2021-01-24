let appConfig = {

    protocol: 'http://',
    host: 'localhost',
    port: process.env.NODE_APP_PORT || 3000,
}

let dbConfig = {

    connection: 'mongodb://localhost:27017/afroinApi'
}

let routeSlug = {

    roles: 'roles',
    users: 'users',
    firstcategories: 'firstcategories',
    secondcategories: 'secondcategories',
    emailtemplates: 'emailtemplates',
    sliderimages: 'sliderimages',
    siteSettings: 'sitesettings'
}

appConfig.baseUrl = appConfig.protocol + appConfig.host + ":" + appConfig.port + '/';

console.log(appConfig.baseUrl);
appConfig.dbConfig = dbConfig;
appConfig.routeSlug = routeSlug;

module.exports = appConfig;