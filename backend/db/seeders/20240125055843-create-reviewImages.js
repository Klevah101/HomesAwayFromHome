'use strict';

const { ReviewImage } = require('../models');
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
        reviewId: 1,
        url: 'https://ichef.bbci.co.uk/images/ic/976x549_b/p031c5dk.jpg'
      },
      {
        reviewId: 2,
        url: 'https://i.pinimg.com/736x/bc/ca/d1/bccad143a058a8f04ca6266868792323.jpg'
      },
      {
        reviewId: 3,
        url: 'https://i.pinimg.com/736x/bc/ca/d1/bccad143a058a8f04ca6266868792323.jpg'
      },
    ];

    ReviewImage.bulkCreate(dataset1, {
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
    await queryInterface.bulkDelete('ReviewImages', {
      where: {
        url: {
          [Op.or]: [
            'https://i.pinimg.com/736x/bc/ca/d1/bccad143a058a8f04ca6266868792323.jpg',
            'https://ichef.bbci.co.uk/images/ic/976x549_b/p031c5dk.jpg']
        }
      }
    }, options)
  }
};
