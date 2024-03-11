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
        description: 'Only five holes in the roof. Front door to be fixed soon.',
        price: 400.99
      },
      {
        ownerId: 1,
        address: '321 Fake St',
        city: 'Boston',
        state: 'Massachusetts',
        country: 'United States',
        lat: -86.2,
        lng: 80.7,
        name: 'Ye old Castle',
        description: 'A regal abode. Please, no peasants...',
        price: 40000000.99
      },
      {
        ownerId: 1,
        address: '???',
        city: '???',
        state: '???',
        country: '???',
        lat: -89.2,
        lng: 80.7,
        name: 'The Hideout',
        description: "They ain't gonna getcha here",
        price: 400.99
      },
      {
        ownerId: 1,
        address: '1 Hollywood ave',
        city: 'Boston',
        state: 'Massachusetts',
        country: 'United States',
        lat: -86.2,
        lng: 80.7,
        name: 'The Mansion',
        description: 'The perfect place for perfect people.',
        price: 400.99
      },
      {
        ownerId: 1,
        address: '2 Oak view',
        city: 'Boston',
        state: 'Massachusetts',
        country: 'United States',
        lat: -89.2,
        lng: 80.7,
        name: "Nature's best",
        description: 'The squirrels are friendly.',
        price: 400.99
      },
      {
        ownerId: 1,
        address: '555 Milky way',
        city: 'Forest',
        state: 'Woods',
        country: 'A land far away',
        lat: -86.2,
        lng: 80.7,
        name: 'Home Sweet Home',
        description: 'No holes in the roof. Front door works.',
        price: 400.99
      },
      {
        ownerId: 2,
        address: '321 Fake St',
        city: 'Boston',
        state: 'Massachusetts',
        country: 'United States',
        lat: -86.2,
        lng: 80.7,
        name: 'The other other Shack',
        description: 'No roof.',
        price: 400.99
      },
      {
        ownerId: 3,
        address: '321 Fake St',
        city: 'Boston',
        state: 'Massachusetts',
        country: 'United States',
        lat: 35,
        lng: 35,
        name: 'A pineapple',
        description: 'A pineapple under the sea.',
        price: 75
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
    await queryInterface.bulkDelete('Spots', {
      where: {
        id: {
          [Op.lt]: 5
        }
      }
    })
  }
};
