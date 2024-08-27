'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_temp_button extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tbl_temp_button.init({
    button_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    temp_id: DataTypes.INTEGER,
    text: DataTypes.STRING,
    background_color:{
      type:DataTypes.STRING,
        defaultValue:"#ffffff"
    },
    textColor: {
      type: DataTypes.STRING,
      defaultValue:"#ff0000"
    },
    button_url: DataTypes.STRING,
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
    }
  }, {
    sequelize,
    modelName: 'tbl_temp_button',
    paranoid:true
  });
  return tbl_temp_button;
};