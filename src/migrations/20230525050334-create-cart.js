const { DataTypes } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cart', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      amount: {
        type: DataTypes.ENUM,
      },
      count: {
        type: DataTypes.INTEGER,
      },
      duration: {
        type: DataTypes.SMALLINT,
      },
      drawDays: {
        type: DataTypes.STRING,
      },
      reference: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.TINYINT,
      },
      status: {
        type: DataTypes.TINYINT,
      },
      buyType: {
        type: DataTypes.TINYINT,
      },
      idLottery: {
        type: DataTypes.INTEGER,
      },
      idGroup: {
        type: DataTypes.INTEGER,
      },
      shares: {
        type: DataTypes.INTEGER,
      },
      idVip: {
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

    await queryInterface.addConstraint('Cart', {
      type: 'unique',
      fields: ['id'],
      name: 'UNIQUE_CART_ID',
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cart')
  },
}
