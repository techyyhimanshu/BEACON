'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DailyTask extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here if necessary
    }
  }
  DailyTask.init({
    task_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    asignBy: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "admin"
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'untitled'
    },
    description: DataTypes.STRING,
    validFrom: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isFutureDate(value) {
          const currentDate = new Date().toISOString().split('T')[0];
          const valueDate = new Date(value).toISOString().split('T')[0];
          if (valueDate < currentDate) {
            throw new Error('validFrom must not be a past date');
          }
        }
      }
    },
    validTill: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isFutureDate(value) {
          if (new Date(value) <= new Date()) {
            throw new Error('validTill must be a future date');
          } else if (new Date(value) < this.validFrom) {
            throw new Error('validTill cannot be earlier than validFrom');
          }
        }
      }
    },
    priority: {
      type: DataTypes.ENUM,
      values: ['low', 'medium', 'high'],
      allowNull: false,
      defaultValue: 'low',
      validate: {
        isIn: {
          args: [['low', 'medium', 'high']],
          msg: "Priority must be one of 'low', 'medium', or 'high'"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'DailyTask',
  });
  return DailyTask;
};
