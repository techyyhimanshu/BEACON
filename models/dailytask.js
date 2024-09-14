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
    personnel_id:{
       type : DataTypes.INTEGER,
       allowNull : false,
       validate : 
       {
        notNull: {
          msg: "Personnel id cannot be null"
        },
        notEmpty: {
          msg: "Personnel id cannot be empty"
        }
       }
      },
    asignBy: {
      type : DataTypes.STRING,
      allowNull : false,
      defaultValue : "admin"
    },
    project:{
      type :DataTypes.STRING,
      allowNull : false, 
      defaultValue : 'Learning Task'
    },
    title: {
      type : DataTypes.STRING,
      allowNull : false,
      defaultValue : "untitled"
    }, 
    description: DataTypes.STRING,
    validFrom: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isFutureDate(value) {
          if (new Date(value) <= new Date()) {
            throw new Error('validFrom must be a future date');
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
          }
        }
      }
    },
    status: {
      type: DataTypes.ENUM,
      values: ['asigned','pending', 'in-progress', 'completed', 'on-hold'],
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: {
          args: [['asigned','pending', 'in-progress', 'completed', 'on-hold']],
          msg: "Status must be one of 'pending', 'in-progress', 'completed', 'on-hold'"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'dailyTask',
  });
  return dailyTask;
};