'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Products.init({
    product_id:{
      type : DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement:true,
      allowNull:false
    },
    product_name: DataTypes.STRING,
    brand: DataTypes.STRING,
    availble_colour: DataTypes.STRING,
    price: DataTypes.INTEGER,
    org_id:{
      type : DataTypes.INTEGER,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};