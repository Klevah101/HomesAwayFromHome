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
        url: 'https://images.unsplash.com/photo-1621631177562-3351be5e26b1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://images.unsplash.com/photo-1599509671551-6879ee499198?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://images.unsplash.com/photo-1444419988131-046ed4e5ffd6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://images.unsplash.com/photo-1517405030045-45f7ad942106?q=80&w=1928&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        preview: false
      },
      {
        spotId: 1,
        url: 'https://plus.unsplash.com/premium_photo-1661378747584-7f223cc85680?q=80&w=2102&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://images.unsplash.com/photo-1606083148414-4177bf30987e?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        preview: true
      },
      {
        spotId: 3,
        url: "https://images.unsplash.com/photo-1544939514-aa98d908bc47?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        preview: true
      },
      {
        spotId: 4,
        url: 'https://media.istockphoto.com/id/1421545971/photo/japanese-house-with-a-large-garden.jpg?s=2048x2048&w=is&k=20&c=f7G49C8IKtgRBURXRJLLOKK4IFW1VFkO-L5iAaQnPXI=',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://media.istockphoto.com/id/1289465701/photo/big-tree-house-in-autumn.jpg?s=2048x2048&w=is&k=20&c=Os6myHKfvAa_KSSoo9BfGFmRXNJmMFSjJ1rr8VL3E7Q=',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://images.unsplash.com/photo-1660489884644-29514b756339?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://images.unsplash.com/photo-1563783850023-077d97825802?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        preview: true
      },
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
