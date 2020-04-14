// dependencies
var db = require("../models");

module.exports = app => {
    app.get("/articles", (req, res) => {
        db.Article.find({}).then(dbArticle => { res.json(dbArticle) });
    })
}