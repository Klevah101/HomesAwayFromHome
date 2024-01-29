'use strict';

const { SpotImage } = require('../models');
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
        spotId: 1,
        url: 'https://previews.123rf.com/images/tomcat2170/tomcat21700903/tomcat2170090300025/4567148-old-worn-down-house.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://stock.adobe.com/images/shack/74440165',
        preview: false
      }
    ];

    SpotImage.bulkCreate(dataset1, {
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
  }
};
