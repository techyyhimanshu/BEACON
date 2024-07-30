'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tempType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tempType.init({
    templateType_id: {
      type : DataTypes.INTEGER,
      primaryKey : true
    },
    category_id: DataTypes.INTEGER,
    template_path: DataTypes.STRING
  }, {
    sequelize,
    paranoid:true,
    modelName: 'tempType',
  });
  return tempType;
};