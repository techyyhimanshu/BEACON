'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_temp_like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tbl_temp_like.init({
    like_id: {
      allowNull: false,
      autoIncrement: true,
      unique : true,
      type: DataTypes.INTEGER
    },
    user_uniqueID: {
      type: DataTypes.STRING,
      primaryKey : true
    },
    temp_id: {
      type: DataTypes.INTEGER,
      primaryKey : true
    },
    status: {
      type: DataTypes.ENUM('0','1','2'),
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue : sequelize.literal('CURRENT_TIMESTAMP()')
    },
  }, {
    sequelize,
    modelName: 'tbl_temp_like',
  });
  return tbl_temp_like;
};