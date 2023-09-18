if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require('express')
const handlebars = require('express-handlebars')
const routes = require('./routes')
const app = express()
const port = process.env.PORT || 3000
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

app.set('view engine', 'hbs')
app.engine("hbs", handlebars({ defaultLayout: 'main', extname: ".hbs" }))
app.use("/", express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(routes)

server.listen(port, () => console.log(`Example app listening on port ${port}!`))