/*  This website scrapes NY Times web site to display 20 articles. There are options to clear all articles, save them, and leave notes. This files launches the server.

    Written by Alex Chalyy on 5/25/2019. */

var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

var titles = [];

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

//mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// Routes
// delete route - delete everything from db
/*
app.listen(PORT);

//---------------------------------------------------------------------------------------------------

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "home"));
});  */

// saved page html route.

app.get("/saved", function (req, res) {
  // res.send("<h1>Hello World!!!</h1>")
  res.render("saved");
});

//---------------------------------------------------------------------------------------------------
//
//  This is home page route.

app.get("/", function (req, res) {
  // res.send("<h1>Hello World!!!</h1>")
  res.render("home");
});

//---------------------------------------------------------------------------------------------------
//
//  API Routes are below.

app.get("/clear", function (req, res) {
  console.log("delete function running");
  // Grab every document in the Articles collection
  db.Article.deleteMany({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
  res.send("Articles deleted");
});

//---------------------------------------------------------------------------------------------------

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.nytimes.com/section/world/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    var result = {};

    // Now, we grab every h2 within an article tag, and do the following:
    $(".css-4jyr1y").each(function (i, element) {
      // Save an empty result object
      result.title = $(this).children("a").children("h2").text();
      console.log("\nTitle: " + result.title);
      titles.push(result.title);
      result.summary = $(this).children("a").children("p").text();
      console.log("\nSummary: " + result.summary);
      result.link = "https://www.nytimes.com" + $(this).children("a").attr("href");
      console.log("\n" + result.link);
      result.saved = false;
      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
    // Send a message to the client
    res.send("Scrape Complete");
  });
});

//---------------------------------------------------------------------------------------------------

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

//---------------------------------------------------------------------------------------------------

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

//---------------------------------------------------------------------------------------------------

// Route for saving/updating an Article's associated Note
app.put("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  console.log("save note is called on server side.");
  console.log("id is " + req.params.id);
  console.log("note is " + req.body.note);
  db.Article.findByIdAndUpdate(
    {_id: req.params.id}, 
    {$push: {notes: req.body.note}}
    )   
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });

});

//---------------------------------------------------------------------------------------------------

app.put("/save/:id", function (req, res) {
  //  Route for updating the article to saved.
  console.log("works here");
  console.log("requested id = " + req.params.id);
  db.Article.findByIdAndUpdate({ _id: req.params.id })
  .set('saved', true)
  .then(function (dbArticle) {
    // If we were able to successfully find an Article with the given id, send it back to the client
    console.log("works after update");
    res.json(dbArticle);
  })
  .catch(function (err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
});

//---------------------------------------------------------------------------------------------------

//  This API function deletes an article from database.

app.delete("/delete/:id", function (req, res) {
  db.Article.deleteOne({ _id: req.params.id })
  .then(function (dbArticle) {
    res.json(dbArticle);
  })
  .catch(function (err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
});

//---------------------------------------------------------------------------------------------------

//  This API function deletes a note from database.

app.delete("/deleteNote/:id", function(req, res)  {
  console.log("note to be deleted is " + req.body.note);
  db.Article.findByIdAndUpdate({ _id: req.params.id}, {$pullAll: {notes: [req.body.note]}})
  .then(function(dbArticle)  {
    res.json(dbArticle);
  })
  .catch(function (err) {
    res.json(err);
  });

});

//---------------------------------------------------------------------------------------------------

// Create a new note
app.post("/notes/save/:id", function(req, res) {
  console.log("this is back end save note api route call");
  // Create a new note and pass the req.body to the entry
  console.log(req.body.text);
  console.log(req.params.id);
  var note = ({
    body: req.body.text,
    article: req.params.id
  });
  console.log("This is note: " + note);
  // And save the new note the db

      db.Article.findOneAndUpdate({ "_id": req.params.id }, {$push: { "notes": note.body } })
      // Execute the above query
      .exec(function(err) {
        // Log any errors
        if (err) {
          console.log(err);
          res.send(err);
        }
        else {
          // Or send the note to the browser
          res.send(note);
        }
      });
});

//---------------------------------------------------------------------------------------------------

app.engine("handlebars", exphbs({ defaultLayouts: "main"}));
app.set("view engine", "handlebars")

//---------------------------------------------------------------------------------------------------

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});

//---------------------------------------------------------------------------------------------------

console.log("server running ok here");