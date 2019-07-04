//Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var axios = require("axios");

//Scraping tools that make NewsScraping possible
var request = require("request");
var cheerio = require("cheerio");
//Setting handlebars
var exphbs = require("express-handlebars");

//Initializing express
var app = express();

var PORT = 3000;

//Middleware configuration:
//Using body-parser for handing form submissions
app.use(bodyParser.urlencoded({ extended: true}));
//Uses express.static to serve the public folder as a static directory
app.use(express.static("public"));

//connecting to the mongo DB
mongoose.connect("mongodb://localhost/fSUNews");

//Routes

//connectivity route testing message:
app.get("/", function(req, res){
    res.send("Hi.");
});

//scraping articles from Google.
// A GET route for scraping the website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    axios.get("https://www.google.com/search?q=florida+state+football+news&source=lnms&sa=X&ved=0ahUKEwjg4MqGz9ndAhXPo1kKHcxqDiQQ_AUICSgA&biw=867&bih=947&dpr=1").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      $("h3 a").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      });
    })
})

app.listen(PORT, function() {
    console.log("App running on port 3000!");
});