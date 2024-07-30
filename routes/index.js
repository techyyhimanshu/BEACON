// routes/index.js
const { Router } = require('express');
const organizationRoute = require('./organizationRoute');
const shopRoute = require('./shopRoute');
const beaconRoute = require('./beaconRoute');
const templateTypeRoute = require('./templateTypeRoute');
const templateRoute = require('./templateRoute');

const routes = Router();
routes.use(organizationRoute);
routes.use(shopRoute);
routes.use(beaconRoute);
routes.use(templateTypeRoute);
routes.use(templateRoute);

module.exports = routes;
