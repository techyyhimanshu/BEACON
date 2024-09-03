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
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    org_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Organization name cannot be null"
        },
        notEmpty: {
          msg: "Organization name cannot be empty"
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Address cannot be null"
        },
        notEmpty: {
          msg: "Address cannot be empty"
        }
      }
    },
    contact_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "contact_number_UNIQUE",
        msg: "Contact number already exist"
      },
      validate: {
        notNull: {
          msg: "Contact number cannot be null"
        },
        notEmpty: {
          msg: "Contact number cannot be empty"
        },
        isNumeric: {
          msg: "Contact number is not correct"
        },
        len: {
          args: [10, 10],
          msg: "Contact number must be 10 digits only"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
          customValidator(value) {
              if (value === null) {
                  throw new Error("Email cannot be null");
              }
              if (value === '') {
                  throw new Error("Email cannot be empty");
              }
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                  throw new Error("Email address is invalid");
              }
          }
      }
  }
  
  }, {
    sequelize,
    paranoid: true,
    modelName: 'OrganizationDetail',
  });
  return OrganizationDetail;
};