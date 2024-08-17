'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_temp_menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tbl_temp_menu.init({
    subMenu_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    temp_id: DataTypes.INTEGER,
    menu_name: DataTypes.STRING,
    textColor: DataTypes.STRING,
    link_url: DataTypes.STRING,
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    createdBy: {
      type: DataTypes.STRING
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedBy: {
      type: DataTypes.STRING
    },
    deletedAt:{
      type : DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'tbl_temp_menu',
    paranoid:true
  });
  return tbl_temp_menu;
};