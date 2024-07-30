// routes/index.js
const { Router } = require('express');
const organizationRoute = require('./organizationRoute');
const shopRoute = require('./shopRoute');

const routes = Router();
routes.use(organizationRoute);
routes.use(shopRoute);

module.exports = routes;
