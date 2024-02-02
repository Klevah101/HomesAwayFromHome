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
        spotId: 1,
        url: 'https://st5.depositphotos.com/8446418/65060/i/1600/depositphotos_650603328-stock-photo-old-hut-mountains-wooden-house.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://stock.adobe.com/images/shack/74440165',
        preview: true
      },
      {
        spotId: 3,
        url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpoohadventures.fandom.com%2Fwiki%2FSpongeBob%2527s_Pineapple_House&psig=AOvVaw2Q9QbSjUZQ0TnkkPaEJfE1&ust=1706901948068000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCIiN8rTvioQDFQAAAAAdAAAAABAE",
        preview: true
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
    await queryInterface.bulkDelete('SpotImages', {
      where: {
        url: {
          [Op.or]: [
            "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpoohadventures.fandom.com%2Fwiki%2FSpongeBob%2527s_Pineapple_House&psig=AOvVaw2Q9QbSjUZQ0TnkkPaEJfE1&ust=1706901948068000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCIiN8rTvioQDFQAAAAAdAAAAABAE",
            'https://stock.adobe.com/images/shack/74440165',
            'https://previews.123rf.com/images/tomcat2170/tomcat21700903/tomcat2170090300025/4567148-old-worn-down-house.jpg'
          ]
        }
      }
    }, options)
  }
};
