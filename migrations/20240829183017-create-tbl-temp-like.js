'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_temp_likes', {
      like_id: {
        allowNull: false,
        autoIncrement: true,
        unique : true,
        type: Sequelize.INTEGER
      },
      user_uniqueID: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      temp_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      status: {
        type: Sequelize.ENUM('0','1','2'),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue : sequelize.literal('CURRENT_TIMESTAMP()')
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_temp_likes');
  }
};