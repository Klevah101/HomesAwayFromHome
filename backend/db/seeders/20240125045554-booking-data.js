'use strict';
const { Booking } = require('../models');
let options = {};

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const dataset1 = [
      {
        userId: 1,
        spotId: 2,
        startDate: '2021-11-20',
        endDate: '2021-11-21'
      },
      {
        userId: 1,
        spotId: 2,
        startDate: '2022-11-20',
        endDate: '2022-11-21'
      },
      {
        userId: 2,
        spotId: 3,
        startDate: '2021-11-20',
        endDate: '2021-11-21'
      },
      {
        userId: 3,
        spotId: 1,
        startDate: '2021-11-20',
        endDate: '2021-11-21'
      },
    ];

    Booking.bulkCreate(dataset1, {
      validate: true
    })

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Bookings', {
      where: {
        id: {
          [Op.lt]: 4
        }
      }
    }, options)

  }
};
