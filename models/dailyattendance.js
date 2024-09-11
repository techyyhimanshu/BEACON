'use strict';
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    inTime: {
      type: DataTypes.TIME
    },
    outTime: {
      type: DataTypes.TIME
    }

  }, {
    sequelize,
    modelName: 'DailyAttendance',
    timestamps: false
  });
  return DailyAttendance;
};