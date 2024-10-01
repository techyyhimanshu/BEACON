'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DailyTaskReports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      personnel_id: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      task_id: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      status: {
        type: Sequelize.ENUM('pending', 'in-progress', 'completed'),
        allowNull: false,
        defaultValue: 'pending'
      },
      description: {
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
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DailyTaskReports');
  }
};