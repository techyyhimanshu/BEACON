'use strict';
const {
  Model
} = require('sequelize');
const Category = require('./index');
const organizationDetail = require('./index');
module.exports = (sequelize, DataTypes) => {
  class DivisionDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DivisionDetails.init({
    div_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    org_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      // references: {
      //   model:organizationdetail,
      //   key: 'org_id'
      // },
      validate: {
        notNull: {
          msg: "Organization id cannot be null"
        },
        notEmpty: {
          msg: "Organization id cannot be empty"
        }
      }
    },
    div_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg:"Division name cannot be null"
        },
        notEmpty: {
          msg: "Division name cannot be empty"
        }
      }
    },
    div_no: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Division number cannot be null"
                },
        notEmpty: {
          msg: "Division number cannot be empty"
        }
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      // references: {
      //   model:Category,
      //   key: 'category_id'
      // },
      validate: {
        notNull: {
          msg: "Category cannot be empty"
        },
        notEmpty:{
          msg: "Category cannot be empty"
        }
      }
    },
    contact_number: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Contact number cannot be empty"
        },
        notEmpty:{
          msg: "Contact number cannot be empty"
        },
        isNumeric: {
          msg: "Contact number is invalid"
        },
        len: {
          args: [10, 10],
          msg: "Contact number must be 10 digits long"
        }

      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Email cannot be empty"
        },
        notEmpty:{
          msg: "Email cannot be empty"
        },
        isEmail: {
          msg: "Email address is invalid"
        }
      }
    }
  }, {
    sequelize,
    paranoid: true,
    modelName: 'divisionDetails',
  });
  return DivisionDetails;
};