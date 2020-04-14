// Dependencies
const axios = require("axios");
const cheerio = require("cheerio");
var db = require("../models");

const url = "https://www.usatoday.com";

module.exports = app => {
    app.get("/", (req, res) => {
        res.render("index");
    });

    app.get("/articles", (req, res) => {
        axios.get(`${url}/news`).then(response => {
            var $ = cheerio.load(response.data);
            $("div[aria-label='More Top Stories'] a").each((i, element) => {
                var result = {}
                var link = $(element).attr("href");

                result.title = $(element).text();
                result.link = `${url}/${link}`;
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