// dependencies
var db = require("../models");

module.exports = app => {
    app.get("/articles", (req, res) => {
        db.Article.find({}).then(dbArticle => { res.json(dbArticle) });
    })

    // find an article by id
    app.get("/articles/:id", function(req, res) {
        db.Article.findById(req.params.id)
        .populate("note")
        .then(dbArticle => {
            res.json(dbArticle);
        })
    })
}