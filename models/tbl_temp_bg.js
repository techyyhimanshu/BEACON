'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_template extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tbl_template.init({
    bgi_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    temp_id: {
      type: DataTypes.INTEGER
    },
    imageUrl: {
      type: DataTypes.STRING
    },
    
  }, {
    sequelize,
    modelName: 'tbl_temp_bgs',
    paranoid:true
  });
  return tbl_template;
};