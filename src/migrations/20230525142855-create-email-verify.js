const { DataTypes } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EmailVerify', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(50),
      },
      code: {
        type: DataTypes.STRING(50),
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

    await queryInterface.addConstraint('EmailVerify', {
      type: 'unique',
      fields: ['id'],
      name: 'UNIQUE_EMAIL_VERIFY_ID',
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('EmailVerify')
  },
}
