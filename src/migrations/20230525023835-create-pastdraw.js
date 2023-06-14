/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pastdraw', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      idLottery: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      date: {
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
      additionalNumbers: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      number: {
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
    await queryInterface.dropTable('Pastdraw')
  },
}
