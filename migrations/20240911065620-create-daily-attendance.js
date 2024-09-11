'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DailyAttendances', {
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
      date:{
        type:Sequelize.DATEONLY,
        allowNull:false
      },
      inTime:{
        type:Sequelize.TIME
      },
      outTime:{
        type:Sequelize.TIME
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DailyAttendances');
  }
};