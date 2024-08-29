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
    temp_id : {
      type : DataTypes.INTEGER,
      autoIncrement : true,
      primaryKey : true,
      allowNull : true

    },
    title: {
      type : DataTypes.STRING
    },
    template_name: {
      type: DataTypes.STRING,
      unique:true
    },
    description: DataTypes.STRING,
    imagePath: DataTypes.STRING,
    videoPath :DataTypes.STRING,
    textColor: DataTypes.STRING,
    backgroundColor: DataTypes.STRING,
    buttonColor: DataTypes.STRING,
    createdAt:DataTypes.DATE,
    createdBy:DataTypes.STRING,
    updatedAt: DataTypes.DATE,
    updatedBy:DataTypes.STRING,
    deletedAt:DataTypes.DATE   
    
  }, {
    sequelize,
    modelName: 'tbl_template',
    paranoid:true
  });
  return tbl_template;
};