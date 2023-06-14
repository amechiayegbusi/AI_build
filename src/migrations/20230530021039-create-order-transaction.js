const { DataTypes } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderTransaction', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      iddOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idTransaction: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      shares: {
        type: DataTypes.INTEGER,
      },
      idAgent: {
        type: DataTypes.INTEGER,
      },
      idTerminal: {
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

    await queryInterface.addConstraint('OrderTransaction', {
      type: 'unique',
      fields: ['id'],
      name: 'UNIQUE_ORDER_TRANSACTION_ID',
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderTransaction')
  },
}
