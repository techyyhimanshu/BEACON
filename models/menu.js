'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Menu.init({
    menu_id: {
      type:DataTypes.INTEGER,
      primaryKey:true
    },
    menu_name: {
      type:DataTypes.STRING,
      allowNull:false
    },
    base_url: {
      type:DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Menu',
  });
  return Menu;
};