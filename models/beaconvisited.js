'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BeaconVisited extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BeaconVisited.init({
    beacon_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_mac: DataTypes.STRING,
    location: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'BeaconVisiteds',
    updatedAt:false
  });
  return BeaconVisited;
};