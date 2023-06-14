const { Status } = require('constants/ConstCountry')
const { DataTypes } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Country', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
      },
      shortName: {
        type: DataTypes.STRING(20),
      },
      code: {
        type: DataTypes.STRING(20),
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: Status.ACTIVE,
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

    await queryInterface.addConstraint('Country', {
      type: 'unique',
      fields: ['id'],
      name: 'UNIQUE_COUNTRY_ID',
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Country')
  },
}
