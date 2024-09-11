'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StudentRecords', {
      user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      father_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dob:{
        type:Sequelize.DATE,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique:true
      },
      phone_one: {
        type: Sequelize.STRING,
        allowNull: false,
        unique:true
      },
      phone_two: {
        type: Sequelize.STRING,
        unique:true
      },
      present_address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      permanent_address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      aadhar_no: {
        type: Sequelize.STRING,
        allowNull: false,
        unique:true
      },
      course: {
        type: Sequelize.STRING,
      },
      date_of_joining:{
        type:Sequelize.DATE,
        allowNull: false,
      },
      device_id:{
        type:DataTypes.STRING,
        allowNull: false,
      },
      image_path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      aadhar_path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pan_card_path: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('StudentRecords');
  }
};