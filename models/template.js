'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class template extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  template.init({
    template_id: {
      type : DataTypes.INTEGER,
      primaryKey :true
    },
    templateType_id: DataTypes.INTEGER,
    valid_from: DataTypes.DATE,
    valid_till: DataTypes.DATE,
    offer_data_1:DataTypes.STRING,
    offer_data_2:DataTypes.STRING,
  }, {
    sequelize,
    paranoid :true,
    modelName: 'template',
  });
  return template;
};