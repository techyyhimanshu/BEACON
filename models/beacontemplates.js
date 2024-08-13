'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BeaconTemplates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BeaconTemplates.init({
    beacon_id: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    template_id: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    parent: {
      type: DataTypes.INTEGER,
    },
    alias: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'BeaconTemplates',
    paranoid:true
  });
  return BeaconTemplates;
};