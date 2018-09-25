//Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//Scraping tools that make NewsScraping possible
var request = require("request");
var cheerio = require("cheerio");
//Setting handlebars
var exphbs = require("express-handlebars");

//Initializing express
var app = express();

//Database configuration
//var db = require("./models");

var PORT = 3000;

//Middleware configuration:
//Using body-parser for handing form submissions
app.use(bodyParser.urlencoded({ extended: true}));
//Uses express.static to serve the public folder as a static directory
app.use(express.static("public"));

//connecting to the mongo DB
mongoose.connect("mongodb://localhost/nytNewsScraper");

//Routes

//connectivity route testing message:
app.get("/", function(req, res){
    res.send("Hi.");
});

// a GET route for scraping the miami new times website.
app.get("/scrape", function(req, res) {
    db.scrapedData.find({}, function(error, found) {
        if (error) {
            console.log(error);
        }
        else {
            res.json(found);
        }
    });
});

//scraping articles from the Miami New Times Headline News section.
app.get("/scrape", function(req, res) {
    request("https://www.miaminewtimes.com/news", function(error, response, html) {
        var $ = cheerio.load(html);
        $(".headline stroke").each(function(i, element) {
            var title = $(element).children("a").text();
            var link = $(element).children("a").attr("href");
            if (title && link) {
                db.scrapedData.insert({
                    title:title,
                    link:link
                },
                function(err, inserted) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(inserted);
                    }
                });
            }
        });
    });
    res.send("Scrape Complete");
});

app.listen(PORT, function() {
    console.log("App running on port 3000!");
});