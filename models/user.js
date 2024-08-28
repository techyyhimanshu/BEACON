'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    user_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    device_id: {
      type: DataTypes.STRING,
      allowNull : false,
      unique : true
    },
    last_location: {
      type: DataTypes.STRING
    },
    full_name:{
      type: DataTypes.STRING,
      allowNull:false
    },
    gender:{
      type: DataTypes.STRING,
      allowNull:false
    },
    dob:{
      type: DataTypes.DATE,
      allowNull:false
    },
    phone:{
      type: DataTypes.STRING,
      unique:true
    },
    email: {
      type: DataTypes.STRING,
      unique : true,
      allowNull:false
    },
    password: {
      type: DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};