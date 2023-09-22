const { User } = require('../models')

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('online_user', (msgObj) => {
      if (msgObj.type === 'join') {
        User.findOne({ where: { id: msgObj.user.id } })
          .then(user => {
            return user.update({
              isJoinPublicRoom: true
            })
          })
          .then(user => {
            io.emit('online_user', {
              type: 'join',
              user
            })
          })
      }
      if (msgObj.type === 'leave') {
        User.findOne({ where: { id: msgObj.user.id } })
          .then(user => {
            return user.update({
              isJoinPublicRoom: false
            })
          })
          .then((user) => {
            io.emit('online_user', {
              type: 'leave',
              user
            })
          })
      }
    })

    socket.on('public_message', (msg) => {
      io.emit('public_message', msg)
    })

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })

  })
}