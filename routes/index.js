// routes/index.js
const { Router } = require('express');
const organizationRoute = require('./organizationRoute');
const divisionRoute = require('./divisionRoute');
const beaconRoute = require('./beaconRoute');
const templateTypeRoute = require('./templateTypeRoute');
const templateRoute = require('./templateRoute');
const adminRoute = require('./adminRoute');
const categoryRoute = require('./categoryRoute');
const userRoute = require('./userRoute');
const menuRoute = require('./menuRoute');
const orgMenuRoute = require('./orgMenuRoute');
const dynamicTempRoute = require('./dynamicTempRoute');
const dynamicBeaconRoute = require('./dynamicBeaconRoute');
const likeRoute = require('./likeRoute');
const personnelRoute = require('./personnelRoute');

// const sp_user = require('./sp_user');





const routes = Router();
routes.use(organizationRoute);
routes.use(divisionRoute);
routes.use(beaconRoute);
routes.use(likeRoute);
routes.use(templateTypeRoute);
routes.use(templateRoute);
routes.use(adminRoute);
routes.use(categoryRoute);
routes.use(userRoute);
routes.use(menuRoute);
routes.use(orgMenuRoute);
routes.use(dynamicBeaconRoute);
routes.use(dynamicTempRoute);
routes.use(personnelRoute);

// extra
// routes.use(sp_user);


module.exports = routes;
