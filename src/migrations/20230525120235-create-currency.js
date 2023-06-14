const { DataTypes } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Currency', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      code: {
        type: DataTypes.STRING(3),
      },
      rate: {
        type: DataTypes.FLOAT,
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

    await queryInterface.addConstraint('Currency', {
      type: 'unique',
      fields: ['id'],
      name: 'UNIQUE_CURRENCY_ID',
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Currency')
  },
}
