'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Menus', {
      menu_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      menu_name: {
        type: Sequelize.STRING
      },
      base_url: {
        type: Sequelize.STRING,
        allowNull:true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE 
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Menus');
  }
};