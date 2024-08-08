'use strict';
const {
  Model
} = require('sequelize');
const { Shop } = require('./shopdetails');
const { template } = require('./template');
module.exports = (sequelize, DataTypes) => {
  class Beacon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Beacon.init({
    beacon_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    beacon_name :{
      type : DataTypes.STRING,
    },
    mac: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: "MAC address cannot be null"
        },
        is: {
          args: /^([0-9A-Za-z]{2}[:-]){5}([0-9A-Za-z]{2})$/,
          msg: "MAC address must be in the format XX:XX:XX:XX:XX:XX"
        }
      }
    },
    shop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique : false,
      references: {
        model: Shop,
        key: "shop_id"
      },
      validate: {
        notNull: {
          msg: "Shop cannot be null"
        }
      }
    },
    template_id:{
      type:DataTypes.INTEGER,
      references:{
        model:template,
        key:'template_id'
      }
    },
    beacon_org:{
      type : DataTypes.STRING,
      allowNull : false
    }
  }, {
    sequelize,
    paranoid: true,
    modelName: 'Beacon',
  });
  return Beacon;
};