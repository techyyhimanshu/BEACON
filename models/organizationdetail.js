'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrganizationDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OrganizationDetail.init({
    org_id: {
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
    },
    org_name: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:"Organization name cannot be empty"
        }
      }
    },
    address:{
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:"Address cannot be empty"
        }
      }
    },
    contact_number:{
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull:{
          msg:"Contact number cannot be empty"
        },
        isNumeric:{
          msg:"Contact number is not correct"
        },
        len:{
          args:[10,10],
          msg:"Contact number must be 10 digits only"
        }
      }
    },
    email: {
      type:DataTypes.STRING,
      unique:true,
      validate:{
        isEmail:{
          msg:"Email address is invalid"
        }
      }
    },
    password_hash: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:{
          msg:"Password cannot be empty"
        }
      }
    },
  }, {
    sequelize,
    paranoid:true,
    modelName: 'OrganizationDetail',
  });
  return OrganizationDetail;
};