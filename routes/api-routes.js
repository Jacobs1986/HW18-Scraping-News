// dependencies
var db = require("../models");

module.exports = app => {
    app.get("/articles", (req, res) => {
        db.Article.find({}).then(dbArticle => { res.json(dbArticle) });
    })

    // get articles by date
    app.get("/articles/date", (req, res) => {
      let searchDate = "Mon Apr 13 2020 13:19:39 GMT-0600 (Mountain Daylight Time)";
      db.Article.find({ date: searchDate} ).then(dbArticle => { res.json(dbArticle) });
    })

    // find an article by id
    app.get("/articles/:id", function(req, res) {
        db.Article.findById(req.params.id)
        .populate('note')
        .then(dbArticle => {
            res.json(dbArticle);
        })
    })

    // Save the note to the database
    app.post("/articles/:id", function(req, res) {
        // save the new note that gets posted to the Notes collection
        db.Note.create(req.body)
        // then find an article from the req.params.id
        // and update it's "note" property with the _id of the new note
        .then(dbNote => {
          return db.Article.findOneAndUpdate(req.params.id, { $push: { note: dbNote._id} }, { new: true});
        })
        .then(dbArticle => {
          res.json(dbArticle);
        })
        .catch(error => {
          res.json(error);
        });
    });
}