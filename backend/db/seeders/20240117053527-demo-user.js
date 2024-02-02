'use strict';
const { User, Sequelize } = require('../models');
const bcrypt = require("bcryptjs");
let options = {};

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const { Op } = Sequelize;
const dataset1 = [
  {
    email: 'demo@user.io',
    username: 'Demo-lition',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    email: 'user1@user.io',
    username: 'FakeUser1',
    hashedPassword: bcrypt.hashSync('password2')
  },
  {
    email: 'user2@user.io',
    username: 'FakeUser2',
    hashedPassword: bcrypt.hashSync('password3')
  }
]


const dataset2 = [
  {
    firstName: 'Nsilo',
    lastName: 'Brown',
    email: 'chuck@appacademy.io',
    username: 'Chuck',
    hashedPassword: bcrypt.hashSync('password')
  },
  {
    firstName: 'Chuck',
    lastName: 'Brown',
    email: 'mrbrown@appacademy.io',
    username: 'MrBrown',
    hashedPassword: bcrypt.hashSync('wordpass')
  },
  {
    firstName: 'Spongebob',
    lastName: 'Squarepants',
    email: 'krustycook@bikinibottom.io',
    username: 'KrustyCook',
    hashedPassword: bcrypt.hashSync('crabbypatty')
  }
];

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

    await User.bulkCreate(dataset2, {
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
    // options.tableName = 'Users';
    // const Op = Sequelize.Op;
    // return queryInterface.bulkDelete(options, {
    //   username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    // }, {});
    const emailNames = dataset2.map(el => el.email);

    await queryInterface.bulkDelete('Users', {
      email: {
        [Op.in]: emailNames
      }
    }, options)
  }

};
