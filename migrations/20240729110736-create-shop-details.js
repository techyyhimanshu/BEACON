'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ShopDetails', {
      shop_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      org_id:{
        allowNull: false,
        type: Sequelize.INTEGER
      },
      shop_name: {
        type: Sequelize.STRING,
        allowNull:false
      },
      shop_no: {
        type: Sequelize.INTEGER,
        allowNull:false,
        unique:true
      },
      category: {
        type: Sequelize.INTEGER
      },
      contact_number: {
        type: Sequelize.INTEGER,
        unique:true
      },
      email: {
        type: Sequelize.STRING,
        unique:true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt:{
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ShopDetails');
  }
};