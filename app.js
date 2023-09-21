if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require('express')
const session = require("express-session")
const passport = require("./config/passport")
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const routes = require('./routes')
const app = express()
const { getUser } = require('./helpers/auth-helpers')
const port = process.env.PORT || 3000
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

const sessionMiddleware = session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
})

app.set('view engine', 'hbs')
app.engine("hbs", handlebars({ defaultLayout: 'main', extname: ".hbs" }))
app.use(methodOverride('_method'))
app.use(flash())
app.use(sessionMiddleware)
app.use(passport.initialize());
app.use(passport.session());
app.use("/", express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
  res.locals.user = getUser(req)
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})
app.use(routes)

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(port, () => console.log(`Example app listening on port ${port}!`))