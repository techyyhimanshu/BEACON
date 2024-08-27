'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
<<<<<<< HEAD
  class tbl_temp_bg extends Model {
=======
  class tbl_template extends Model {
>>>>>>> 7beeff936939e75e83f64646b7c808fa13b03587
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
<<<<<<< HEAD
  tbl_temp_bg.init({
=======
  tbl_template.init({
>>>>>>> 7beeff936939e75e83f64646b7c808fa13b03587
    bgi_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
<<<<<<< HEAD
    temp_id: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tbl_temp_bg',
  });
  return tbl_temp_bg;
=======
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
>>>>>>> 7beeff936939e75e83f64646b7c808fa13b03587
};