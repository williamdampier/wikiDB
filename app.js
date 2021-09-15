const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI);

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);


//TODO
/* Home route */
app.get("/", (req, res) => {
  res.send("Building API");
})
/* ************************************* */

/* path to: GET, POST and DELETE for ALL articles */
app.route("/articles")

  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }

    });
  })

  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    })

    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added article to Mongoose");
      } else {
        res.send(err);
      }

    });
  })

  .delete(function(req, res) {

    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted all articles!");
      } else {
        res.send(err);
      }
    });

  });
/* ************************************* */

/* Path to specific Article: Get, Update, Delete */

app.route("/articles/:title")

  .get(function(req,res){


    Article.findOne({title: req.params.title}, function(err, foundArticle){
      if(!err) {
        if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles with that title found");
      }
    }
    })
  })


  .put(function(req,res)
  {
    Article.update(
      {title: req.params.title},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},

      function(err, updatedArticle){
      if(!err) {
        res.send(req.params.title + " updated!");
      }
      else
      {
        res.send("No articles with that title found");
      }
    });

  })

  .patch(function(req,res){
    Article.update(
      {title: req.params.title},
      {$set: req.body},
      function(err){
        if (!err) {
          res.send("Successfully updated");
        }
        else {
          res.send(err);
        }
      }
    )

  })

  .delete(function(req,res){
    let articleName = req.params.title;
    Article.deleteOne({title: req.params.title}, function(err){
      if(!err){
        res.send("Successfully Deleted Article with title: " + articleName);
      }
      else {res.send(err);}
    });
  })

/* ************************************* */
app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
