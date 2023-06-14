const { DataTypes } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Order', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idCart: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
      },
      prize: {
        type: DataTypes.INTEGER,
      },
      duration: {
        type: DataTypes.INTEGER,
      },
      drawDayCurrent: {
        type: DataTypes.INTEGER,
      },
      drawDays: {
        type: DataTypes.STRING(500),
      },
      reference: {
        type: DataTypes.STRING(100),
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
      mainNumbers: {
        type: DataTypes.STRING(100),
      },
      bonusNumbers: {
        type: DataTypes.STRING(100),
      },
      idTicket: {
        type: DataTypes.STRING(100),
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
      idVoucherUser: {
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

    await queryInterface.addConstraint('Order', {
      type: 'unique',
      fields: ['id'],
      name: 'UNIQUE_ORDER_ID',
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Order')
  },
}
