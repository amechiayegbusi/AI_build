/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Timezone', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      value: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      abbr: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      offset: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      isdst: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      text: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      utc: {
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
    await queryInterface.dropTable('Timezone')
  },
}
