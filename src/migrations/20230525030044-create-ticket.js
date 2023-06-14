/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ticket', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.STRING,
      },
      idContentfulGame: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      duration: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      random: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      multiplier: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      mainNumbers: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      bonusNumbers: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      count: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      pricePerTicket: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      idUser: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      idGame: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      idGroup: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      idVipcomb: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      idTransaction: {
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
    await queryInterface.dropTable('Ticket')
  },
}
