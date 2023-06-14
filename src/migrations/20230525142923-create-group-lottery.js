/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Grouplottery', {
      id: {
        allowNull: false,        
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      idLottery: {
        type: Sequelize.INTEGER,
      },
      drawDay: {
        type: Sequelize.INTEGER,
      },
      shares: {
        type: Sequelize.INTEGER,
      },
      pricePerShares: {
        type: Sequelize.INTEGER,
      },
      ticketCount: {
        type: Sequelize.INTEGER,
      },
      active: {
        type: Sequelize.TINYINT,
      },
      createdAt: {
        type: Sequelize.DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: 'updated_at'
      },
      deletedAt: {
        type: Sequelize.DATE,
        field: 'deleted_at'
      }
    })

    await queryInterface.addConstraint('Grouplottery', {
      type: 'unique',
      fields: ['id'],
      name: 'UNIQUE_GROUP_LOTTERY_ID',
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Grouplottery')
  },
}
