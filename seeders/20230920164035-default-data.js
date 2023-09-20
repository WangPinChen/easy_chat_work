'use strict';
const bcrypt = require('bcryptjs')
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const USER_COUNT = 250
    const COMMENT_COUNT = 10
    const userPromises = []
    for (let i = 1; i <= USER_COUNT; i++) {
      let accountNum = ''
      if (i < 10) {
        accountNum = '0' + i
      } else {
        accountNum = i
      }
      const account = `user${accountNum}`
      const password = account
      const hash = await bcrypt.hash(password, 10)
      const user = {
        name: account,
        account,
        password: hash,
        self_intro: faker.lorem.text(),
        avatar: `https://loremflickr.com/480/520/selfie/?random=${Math.random() * 100}`,
        background: `https://loremflickr.com/1280/480/view/?random=${Math.floor(Math.random() * 100)}`,
        created_at: new Date(),
        updated_at: new Date()
      }
      userPromises.push(user)
    }
    await queryInterface.bulkInsert('Users', userPromises)
    const commentPromises = []

    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    users.forEach(user => {
      const recipient_id = user.id
      for (let i = 0; i < COMMENT_COUNT; i++) {
        const commenter_id = users[Math.floor(Math.random() * USER_COUNT)].id
        if (commenter_id === recipient_id) {
          i -= 1
        }
        const comment = {
          recipient_id,
          commenter_id,
          comment: faker.lorem.text(),
          created_at: new Date(),
          updated_at: new Date()
        }
        commentPromises.push(comment)
      }
    })
    await queryInterface.bulkInsert('Comments', commentPromises)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
    await queryInterface.bulkDelete('Comments', null, {})
  }
};
