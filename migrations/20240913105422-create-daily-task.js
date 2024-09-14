'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dailyTasks', {
      task_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      personnel_id: {
        type: Sequelize.INTEGER,
        allowNull : false
      },
      asignBy: {
        type: Sequelize.STRING,
        allowNull : false,
        defaultValue : "admin"
      },
      project: {
        type: Sequelize.STRING,
        allowNull : false, 
        defaultValue : 'Learning Task'
      },
      title: {
        type: Sequelize.STRING,
        allowNull : false, 
        defaultValue : 'untitled'
      },
      description: {
        type: Sequelize.STRING
      },
      validFrom: {
        type: Sequelize.DATE
      },
      validTill: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM,
        values: ['asigned','pending', 'in-progress', 'completed', 'on-hold'],
        allowNull: false,
        defaultValue: 'pending',
        validate: {
          isIn: {
            args: [['asigned','pending', 'in-progress', 'completed', 'on-hold']],
            msg: "Status must be one of 'pending', 'in-progress', 'completed', 'on-hold'"
          }
        }
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
    await queryInterface.dropTable('dailyTasks');
  }
};