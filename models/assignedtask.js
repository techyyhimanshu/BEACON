'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AssignedTask extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AssignedTask.init({
    assignedTaskId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    task_id: DataTypes.INTEGER,
    
    personnel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Personnel ID cannot be null"
        },
        notEmpty: {
          msg: "Personnel ID cannot be empty"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'AssignedTask',
  });
  return AssignedTask;
};