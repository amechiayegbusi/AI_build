/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pastdrawmatches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      idPastDraw: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      match: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      prize: {
        allowNull: true,
        type: Sequelize.BIGINT,
      },
      total: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      regional: {
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
    await queryInterface.dropTable('Pastdrawmatches')
  },
}
