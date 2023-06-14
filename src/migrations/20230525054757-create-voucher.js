/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Voucher', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      code: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      amount: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      whereType: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      moneyType: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      bonusType: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      count: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      usageCount: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      hasLottery: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      cashThreshold: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      startDate: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      endDate: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      title: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      enabled: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        field: 'created_at',
        allowNull: true,
        type: Sequelize.DATE,
      },
      updatedAt: {
        field: 'updated_at',
        allowNull: true,
        type: Sequelize.DATE,
      },
      deletedAt: {
        field: 'deleted_at',
        allowNull: true,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Voucher')
  },
}
