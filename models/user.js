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
      unique : true,
      validate:{
      notNull:{
        msg : "Device ID is required"
      },
      customValidator(value){
        if(!value){
          throw new Error("Device ID is required")
        }
      }
    }
    },
    last_location: {
      type: DataTypes.STRING
    },
    full_name:{
      type: DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:"Name is required"
        },
        notEmpty:{
          msg:"Name is required"
        },
        isAlpha:{
          msg:"Name should only contain alphabets"
        },
        len: {
          args: [2, 20],
          msg: "Name should be atleast 2 characters long"
        }
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull(value) {
          if (value === null) {
            throw new Error("Gender is required");
          }
        },
        customValidator(value) {
          if (!value) {
            throw new Error("Gender is required");
          }
          if (!['male', 'female', 'other'].includes(value)) {
            throw new Error("Invalid gender.");
          }
        }
      }
    },    
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull:{
          msg:"Date of birth is required"
        },
       customValidator(value){
          if (!value) {
            throw new Error("Date of birth is required");
          }
          if(value.isDate){
            throw new Error("Invalid date of birth");
          }
          // Check if the value is a valid date
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            throw new Error("Invalid Date");
          }
          // Optionally, add more date validation logic here
          // For example, check if the date is in the past
          const today = new Date();
          if (date > today) {
            throw new Error("Date of birth cannot be in the future");
          }
        }
       }
    },
    
    
    phone:{
      type: DataTypes.STRING,
      unique:true,
      isNumeric: {
        msg: "Contact number is invalid"
      },
      len: {
        args: [10, 10],
        msg: "Contact number must be 10 digits long"
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull:{
          msg:"Email is required"
        },
        customValidator(value) {
          if (!value) {
            throw new Error("Email is required");
          }
          // Check if the value is a valid email address
          if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)) {
            throw new Error("Invalid email");
          }
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:"Password is required"
        },
        customValidator(value){
          if(!value){
            throw new Error("Password is required")
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};