'use strict';

// /** @type {import('sequelize-cli').Migration} */

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    console.log("Starting the seeding process...");

    try {
      await User.bulkCreate([
        {
          firstName: 'Bob',
          lastName: 'Dylan',
          email: 'demo@user.io',
          username: 'Demo-lition',
          hashedPassword: bcrypt.hashSync('password')
        },
        {
          firstName: 'Kevin',
          lastName: 'Jones',
          email: 'user1@user.io',
          username: 'FakeUser1',
          hashedPassword: bcrypt.hashSync('password2')
        },
        {
          firstName: 'Pete',
          lastName: 'Clark',
          email: 'user2@user.io',
          username: 'FakeUser2',
          hashedPassword: bcrypt.hashSync('password3')
        }
      ], { validate: true });

      console.log("Seeding process completed successfully.");
    } catch (error) {
      console.error("Error during seeding:", error);  // This will provide more details about the error
    }
  },


  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;

    try {
      await queryInterface.bulkDelete(options, {
        username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
      }, {});
      console.log("Rollback process completed successfully.");
    } catch (error) {
      console.error("Error during rollback:", error);  // This will provide more details about the rollback error
    }
  }
};
