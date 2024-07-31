'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrganizationDetails', {
      org_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      org_name: {
        type: Sequelize.STRING,
        allowNull:false
      },
      address: {
        type: Sequelize.STRING,
        allowNull:false
      },
      contact_number: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      email: {
        type: Sequelize.STRING,
        unique:true
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull:false
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
    await queryInterface.dropTable('OrganizationDetails');
  }
};