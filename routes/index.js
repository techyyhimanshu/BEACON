// routes/index.js
const { Router } = require('express');
const organizationRoute = require('./organizationRoute');
const shopRoute = require('./shopRoute');
const templateTypeRoute = require('./templateTypeRoute');

const routes = Router();
routes.use(organizationRoute);
routes.use(shopRoute);
routes.use(templateTypeRoute);

module.exports = routes;
