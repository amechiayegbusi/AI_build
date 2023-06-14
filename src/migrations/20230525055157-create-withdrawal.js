/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Withdrawal', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      accountName: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      accountNumber: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      bankName: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      idAdmin: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      created_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Withdrawal')
  },
}
