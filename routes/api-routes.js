// Dependencies
const axios = require("axios");
const cheerio = require("cheerio");
var db = require("../models");
const url = "https://www.usatoday.com";


module.exports = app => {
  app.get("/articles", (req, res) => {
    db.Article.find({}).then(dbArticle => { res.json(dbArticle) });
  })

  // get articles by date
  app.get("/articles/date", (req, res) => {
    let searchDate = new Date();
    db.Article.find({ date: searchDate }).then(dbArticle => { res.json(dbArticle) });
  })

  // find an article by id
  app.get("/articles/:id", function (req, res) {
    db.Article.findById(req.params.id)
      .populate('note')
      .then(dbArticle => {
        res.json(dbArticle);
      })
  })

  // Save the note to the database
  app.post("/articles/:id", function (req, res) {
    // save the new note that gets posted to the Notes collection
    db.Note.create(req.body)
      // then find an article from the req.params.id
      // and update it's "note" property with the _id of the new note
      .then(dbNote => {
        return db.Article.findOneAndUpdate(req.params.id, { $push: { note: dbNote._id } }, { new: true });
      })
      .then(dbArticle => {
        res.json(dbArticle);
      })
      .catch(error => {
        res.json(error);
      });
  });

  app.get("/scrape", (req, res) => {
    axios.get(`${url}/news`).then(response => {
      var $ = cheerio.load(response.data);
      $("div[aria-label='More Top Stories'] a").each((i, element) => {
        var result = {}
        var link = $(element).attr("href");

        result.date = new Date();
        result.title = $(element).text();
        result.link = `${url}${link}`;
        result.summary = $(element).attr("data-c-br");

        db.Article.create(result)
          .then(function (dbArticle) {
            console.log(dbArticle);
          }).catch(function (error) {
            console.log(error)
          });
      });
      res.send("Scrape Complete");
    });
  });
}