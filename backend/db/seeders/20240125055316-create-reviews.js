'use strict';

const { Review } = require('../models');
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
        review: "Not sure if I would recommend this one. Lots more holes in the roof then stated in the advert. Will be asking for a refund.",
        stars: 1
      },
      {
        userId: 1,
        spotId: 3,
        review: "Wonderful place",
        stars: 5
      },
      {
        userId: 2,
        spotId: 3,
        review: "A bit damp",
        stars: 4
      },
      {
        userId: 3,
        spotId: 1,
        review: "Great place to hideout for a while",
        stars: 4
      },
    ];

    Review.bulkCreate(dataset1, {
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
    await queryInterface.bulkDelete("Reviews", {
      where: {
        id: {
          [Op.lt]: 4
        }
      }
    }, options)
  }
};
