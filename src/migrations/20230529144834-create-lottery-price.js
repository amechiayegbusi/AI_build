// const { DataTypes } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LotteryPrice', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idLottery: {
        type: Sequelize.INTEGER,
      },
      pricePerLine: {
        type: Sequelize.INTEGER,
      },
      priceMultiplier: {
        type: Sequelize.INTEGER,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      idContentfulDuration: {
        type: Sequelize.STRING(100),
      },
      createdAt: {
        allowNull: true,
        field: 'created_at',
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        field: 'updated_at',
        type: Sequelize.DATE,        
      },
      deletedAt: {
        allowNull: true,
        field: 'deleted_at',
        type: Sequelize.DATE,        
      }
    })

    await queryInterface.addConstraint('LotteryPrice', {
      type: 'unique',
      fields: ['id'],
      name: 'UNIQUE_LOTTERY_PRICE_ID',
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('LotteryPrice')
  },
}
