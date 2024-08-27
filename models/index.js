'use strict';

const fs = require('fs');
const path = require('path');
const {Sequelize,DataTypes} = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
// Load and attach models
db.Shop = require('./shopdetails')(sequelize, DataTypes);
db.Organization = require('./organizationdetail')(sequelize, DataTypes);
db.Category = require('./category')(sequelize, DataTypes);
db.Beacon = require('./beacon')(sequelize, DataTypes);
db.temptype = require('./temptype')(sequelize, DataTypes);
db.template = require('./template')(sequelize, DataTypes);
db.BeaconVisited = require('./beaconvisited')(sequelize, DataTypes);
db.user = require('./user')(sequelize, DataTypes);
db.menu = require('./menu')(sequelize, DataTypes);
db.OrgMenu = require('./orgmenu')(sequelize, DataTypes);
db.BeaconTemplate = require('./beacontemplates')(sequelize, DataTypes);
db.tbl_template = require('./tbl_template')(sequelize, DataTypes);
db.tbl_temp_content = require('./tbl_temp_content')(sequelize, DataTypes);
db.tbl_temp_button = require('./tbl_temp_button')(sequelize, DataTypes);
db.tbl_temp_menu = require('./tbl_temp_menu')(sequelize, DataTypes);
db.bgImages = require('./tbl_temp_bg')(sequelize, DataTypes);


db.tbl_temp_menu.belongsTo(db.tbl_template,{foreignKey:'temp_id'})
db.tbl_template.hasMany(db.tbl_temp_menu,{foreignKey:'temp_id'})

db.bgImages.belongsTo(db.tbl_template,{foreignKey:'temp_id'})
db.tbl_template.hasMany(db.bgImages,{foreignKey:'temp_id'})

db.tbl_temp_button.belongsTo(db.tbl_template,{foreignKey:'temp_id'})
db.tbl_template.hasMany(db.tbl_temp_button,{foreignKey:'temp_id'})

db.tbl_temp_content.belongsTo(db.tbl_template,{foreignKey:'temp_id'})
db.tbl_template.hasMany(db.tbl_temp_content,{foreignKey:'temp_id'})

db.temptype.hasMany(db.template,{foreignKey:'templateType_id'})
db.template.belongsTo(db.temptype,{foreignKey:'templateType_id'})

db.BeaconVisited.hasMany(db.user,{foreignKey:'user_mac'})
db.user.belongsTo(db.BeaconVisited,{foreignKey:'user_mac'})

db.template.hasMany(db.Beacon,{foreignKey:'template_id'})
db.Beacon.belongsTo(db.template,{foreignKey:'template_id'})

db.Category.hasMany(db.temptype,{foreignKey:'category_id'})
db.temptype.belongsTo(db.Category,{foreignKey:'category_id'})

db.Organization.hasMany(db.Shop,{foreignKey:"org_id"})
db.Shop.belongsTo(db.Organization,{foreignKey:"org_id"})

db.Category.hasMany(db.Shop,{foreignKey:'category'})
db.Shop.belongsTo(db.Category,{foreignKey:'category'})

db.Shop.hasOne(db.Beacon,{foreignKey:'shop_id'})
db.Beacon.belongsTo(db.Shop,{foreignKey:'shop_id'})

db.BeaconTemplate.hasMany(db.template,{foreignKey:'template_id'})
db.template.belongsTo(db.BeaconTemplate,{foreignKey:'template_id'})

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
