'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class dailyTask extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  dailyTask.init({
    task_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    personnel_id: DataTypes.INTEGER,
    asignBy: DataTypes.STRING,
    project: DataTypes.STRING,
    title: DataTypes.STRING,
    
    description: DataTypes.STRING,
    validFrom: DataTypes.DATE,
    validTill: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'dailyTask',
  });
  return dailyTask;
};