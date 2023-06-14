'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sessions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        field: 'user_id',
        type: Sequelize.INTEGER
      },
      token: {
        type: Sequelize.TEXT
      },
      ipAddress: {
        field: 'ip_address',
        type: Sequelize.STRING
      },
      device: {
        type: Sequelize.STRING
      },
      platform: {
        type: Sequelize.STRING
      },      
      createdAt: {
        field: 'created_at',
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        field: 'updated_at',
        allowNull: true,
        type: Sequelize.DATE
      },
      deletedAt: {
        field: 'deleted_at',
        allowNull: true,
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Sessions');
  }
};