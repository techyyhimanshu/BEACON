'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Services extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Services.init({
    service_id:{
      type : DataTypes.INTEGER,
      primaryKey :true,
      allowNull:false ,
      autoIncrement:true
    },
    service_name: DataTypes.STRING,
    description: DataTypes.STRING,
    org_id:{
      type : DataTypes.INTEGER,
      allowNull : false
    }
  }, {
    sequelize,
    modelName: 'Services',
  });
  return Services;
};