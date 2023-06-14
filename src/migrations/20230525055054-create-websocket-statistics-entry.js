/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WebsocketsStatisticsEntries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      appId: {
        field: 'app_id',
        type: Sequelize.STRING,
      },
      peakConnectionCount: {
        field: 'peak_connection_count',
        type: Sequelize.INTEGER,
      },
      websocketMessageCount: {
        field: 'websocket_message_count',
        type: Sequelize.INTEGER,
      },
      apiMessageCount: {
        field: 'api_message_count',
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
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('WebsocketsStatisticsEntries')
  },
}
