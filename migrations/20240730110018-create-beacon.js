'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Beacons', {
      beacon_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      beacon_name :{
        type : DataTypes.STRING,
      },
      mac: {
        type: Sequelize.STRING,
        unique:true,
        allowNull:false
      },
      shop_id: {
        type: Sequelize.INTEGER,
        allowNull :false
      },
      template_id: {
        type: Sequelize.INTEGER
      },
      beacon_org:{
        type : Sequelize.STRING,
        allowNull : false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Beacons');
  }
};