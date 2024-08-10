'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrgMenu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OrgMenu.init({
    org_menu_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    menu_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
   org_id: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    alias: {
      type: DataTypes.STRING,
      allowNull:false
    },
    url: {
      type: DataTypes.STRING,
      allowNull:true
    }
  }, {
    sequelize,
    modelName: 'OrgMenu',
    tableName:"OrgMenu"
  });
  return OrgMenu;
};