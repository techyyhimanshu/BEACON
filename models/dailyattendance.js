'use strict';
const { database } = require('firebase-admin');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DailyAttendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DailyAttendance.init({
    personnel_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timestamps:{
      type:DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'DailyAttendance',
    timestamps: false
  });
  return DailyAttendance;
};