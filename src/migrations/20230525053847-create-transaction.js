/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transaction', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      idUser: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      idPaymentMethod: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      amount: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      status: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      type: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      bonusType: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      paymentRef: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      idPaymentMethodConfig: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      idObjector: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      idObjectorPaymentMethod: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      idRef: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      idOrder: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      orderNo: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      logId: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      idWithdrawal: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      idDraw: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      idPlaywin: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      idVoucherUser: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      idAgent: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      idTerminal: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      idManager: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      reason: {
        allowNull: true,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Transaction')
  },
}
