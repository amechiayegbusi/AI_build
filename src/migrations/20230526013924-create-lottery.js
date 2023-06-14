/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Lottery', {
      id: {
        allowNull: false,
        primaryKey: true, 
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      idContentfulGame: {
        type: Sequelize.STRING(255),
      },
      name: {
        type: Sequelize.STRING(255),
      },
      link: {
        type: Sequelize.STRING(100),
      },
      caption: {
        type: Sequelize.STRING(100),
      },
      enabled: {
        type: Sequelize.TINYINT,
      },
      jackpot: {
        type: Sequelize.BIGINT,
      },
      numberMax: {
        type: Sequelize.INTEGER,
      },
      numberCount: {
        type: Sequelize.INTEGER,
      },
      bonusMin: {
        type: Sequelize.INTEGER,
      },
      bonusMax: {
        type: Sequelize.INTEGER,
      },
      bonusNumCount: {
        type: Sequelize.INTEGER,
      },
      nextDrawTime: {
        type: Sequelize.BIGINT,
      },
      startBuingTime: {
        type: Sequelize.BIGINT,
      },
      endBuingTime: {
        type: Sequelize.BIGINT,
      },
      currency: {
        type: Sequelize.STRING(3),
      },
      cutOffTime: {
        type: Sequelize.STRING(20),
      },
      cutOffTimeSat: {
        type: Sequelize.STRING(255),
      },
      drawDays: {
        type: Sequelize.STRING(255),
      },
      pow: {
        type: Sequelize.STRING(10),
      },
      backgroundImgUrl: {
        type: Sequelize.STRING(255),
      },
      groupEnabled: {
        type: Sequelize.TINYINT,
      },
      gTickets: {
        type: Sequelize.SMALLINT,
      },
      gDefaultTickets: {
        type: Sequelize.SMALLINT,
      },
      gShares: {
        type: Sequelize.SMALLINT,
      },
      gDefaultShares: {
        type: Sequelize.SMALLINT,
      },
      gSharePrice: {
        type: Sequelize.INTEGER,
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

    await queryInterface.addConstraint('Lottery', {
      type: 'unique',
      fields: ['id'],
      name: 'UNIQUE_LOTTERY_ID',
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Lottery')
  },
}
