/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vip', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      type: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      comboCount: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      ticketCount: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      drawsCount: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      discount: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      logoImgUrl: {
        allowNull: true,
        allowNull: true,
        type: Sequelize.STRING,
      },
      status: {
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
    await queryInterface.dropTable('Vip')
  },
}
