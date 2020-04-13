// Dependencies
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

const url = "https://www.usatoday.com";

module.exports = app => {
    app.get("/", (req, res) => {
        axios.get(`${url}/news`).then(response => {
            var $ = cheerio.load(response.data);
        })
        res.render("index");
    });
}