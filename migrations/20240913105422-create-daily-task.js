'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DailyTasks', {
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
      project_id: {
        type: Sequelize.INTEGER,
        allowNull : false, 
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
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          isFutureDate(value) {
            if (new Date(value) <= new Date()) {
              throw new Error('validFrom must be a future date');
            }
          }
        }
      },
      validTill: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          isAfterValidFrom(value) {
            if (new Date(value) <= new Date(this.validFrom)) {
              throw new Error('validTill must be after validFrom');
            }
          }
        }
      },
      priority: {
        type: Sequelize.ENUM,
        values: ['low', 'medium', 'high'],
        allowNull: false,
        defaultValue: 'low'
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
    await queryInterface.dropTable('DailyTasks');
  }
};
