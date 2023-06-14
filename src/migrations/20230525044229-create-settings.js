const { DataTypes } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Settings', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      key: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      value: {
        type: DataTypes.STRING,
        defaultValue: '',
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

    await queryInterface.addConstraint('Settings', {
      type: 'unique',
      fields: ['id'],
      name: 'UNIQUE_SETTING_ID',
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Settings')
  },
}
