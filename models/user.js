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
      allowNull:false,
      validate:{
        notNull:{
          msg:"Full name is required"
        },
        notEmpty:{
          msg:"Full name is required"
        }
      }
    },
    gender:{
      type: DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:"Gender is required"
        },
        notEmpty:{
          msg:"Gender is required"
        },
        isAlpha:{
          msg:"Invalid  gender"
        }
      }
    },
    dob:{
      type: DataTypes.DATE,
      allowNull:false,
      validate:{
        notNull:{
          msg:"DOB is required"
        },
        notEmpty:{
          msg:"DOB is required"
        },
        isDate:{
          msg:"Invalid Date"
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
      unique : true,
      allowNull:false,
      validate:{
        notNull:{
          msg:"Email is required"
        },
        notEmpty:{
          msg:"Email is required"
        },
        isEmail:{
          msg:"Invalid email"
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
        notEmpty:{
          msg:"Password is required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};