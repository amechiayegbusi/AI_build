const { DataTypes } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Draw', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idTicket: {
        type: DataTypes.STRING(255),
      },
      idTransaction: {
        type: DataTypes.INTEGER,
      },
      token: {
        type: DataTypes.STRING(100),
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      mainNumbersPlayed: {
        type: DataTypes.STRING(255),
      },
      bonusNumbersPlayed: {
        type: DataTypes.STRING(255),
      },
      prize: {
        type: DataTypes.INTEGER,
      },
      drawDayLtech: {
        type: DataTypes.INTEGER,
      },
      drawDay: {
        type: DataTypes.INTEGER,
      },
      scan: {
        type: DataTypes.STRING(255),
      },
      number: {
        type: DataTypes.INTEGER,
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at'
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: 'deleted_at'
      }
    })

    await queryInterface.addConstraint('Draw', {
      type: 'unique',
      fields: ['id'],
      name: 'UNIQUE_DRAW_ID',
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Draw')
  },
}
