const { DataTypes } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Groupuser', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idGroup: {
        type: DataTypes.INTEGER,
      },
      idUser: {
        type: DataTypes.INTEGER,
      },
      shares: {
        type: DataTypes.INTEGER,
      },
      idTransaction: {
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

    await queryInterface.addConstraint('Groupuser', {
      type: 'unique',
      fields: ['id'],
      name: 'UNIQUE_GROUP_USER_ID',
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Groupuser')
  },
}
