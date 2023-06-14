/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PersonalAccessTokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tokenableType: {
        type: Sequelize.STRING,
      },
      tokenableId: {
        type: Sequelize.BIGINT,
      },
      name: {
        type: Sequelize.STRING,
      },
      token: {
        type: Sequelize.STRING,
      },
      abilities: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      lastUsedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      expiresAt: {
        allowNull: true,
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('PersonalAccessTokens')
  },
}
