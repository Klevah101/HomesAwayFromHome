'use strict';

const { Spot } = require('../models');
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
        ownerId: 1,
        address: '123 Fake St',
        city: 'Boston',
        state: 'Massachusetts',
        country: 'United States',
        lat: -89.2,
        lng: 80.7,
        name: 'The Shack',
        description: 'Only five holes in the roof. Front door to be fixed "soon."',
        price: 400.99
      },
    ];

    await Spot.bulkCreate(dataset1, {
      validate: true
    });

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    // options.tableName = 'Spots';
    // const Op = Sequelize.Op;
    // return queryInterface.bulkDelete(options, {
    //   username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    // }, {});
  }
};
