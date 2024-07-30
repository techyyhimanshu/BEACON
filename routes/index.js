// routes/index.js
const { Router } = require('express');
const organizationRoute = require('./organizationRoute');
const shopRoute = require('./shopRoute');
const beaconRoute = require('./beaconRoute');

const routes = Router();
routes.use(organizationRoute);
routes.use(shopRoute);
routes.use(beaconRoute);

module.exports = routes;
