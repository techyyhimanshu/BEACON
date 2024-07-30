'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tempTypes', {
      templateType_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique :true,
        primaryKey:true
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull :false,
      },
      template_path: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tempTypes');
  }
};