'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrgMenu', {
      org_menu_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      menu_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
     org_id: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      alias: {
        type: Sequelize.STRING,
        allowNull:false
      },
      url:{
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
    await queryInterface.dropTable('OrgMenu');
  }
};