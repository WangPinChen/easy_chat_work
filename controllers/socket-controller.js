module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('online_user', (user) => {
      io.emit('online_user', user)
    })

    socket.on('public_message', (msg) => {
      io.emit('public_message', msg)
    })

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })

  })
}