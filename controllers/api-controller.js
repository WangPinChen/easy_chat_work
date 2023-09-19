const apiController = {
  getUser: async (req, res) => {
    res.json(req.user)
  }
}

module.exports = apiController