const { DataTypes } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Language', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      code: {
        type: DataTypes.STRING(10),
      },
      label: {
        type: DataTypes.STRING(255),
      },
      locale: {
        type: DataTypes.STRING(5),
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

    await queryInterface.addConstraint('Language', {
      type: 'unique',
      fields: ['id'],
      name: 'UNIQUE_LANGUAGE_ID',
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Language')
  },
}
