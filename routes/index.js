// routes/index.js
const { Router } = require('express');
const organizationRoute = require('./organizationRoute');
const shopRoute = require('./shopRoute');
const beaconRoute = require('./beaconRoute');
const templateTypeRoute = require('./templateTypeRoute');
const templateRoute = require('./templateRoute');
const adminRoute = require('./adminRoute');
const categoryRoute = require('./categoryRoute');
const userRoute = require('./userRoute');
const menuRoute = require('./menuRoute');


const routes = Router();
routes.use(organizationRoute);
routes.use(shopRoute);
routes.use(beaconRoute);
routes.use(templateTypeRoute);
routes.use(templateRoute);
routes.use(adminRoute);
routes.use(categoryRoute);
routes.use(userRoute);
routes.use(menuRoute);



module.exports = routes;
