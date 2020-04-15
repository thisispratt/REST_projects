var express = require("express");
var app = express();

//to make req.body object and retrieve the data from the form.
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

//to fake POST request as PUT and DELETE.
var methodOverride = require('method-override');
app.use(methodOverride('_method'));

//DATABASE SETUP
var mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost/catsBlog", {useNewUrlParser: true, useUnifiedTopology: true});

var catSchema = new mongoose.Schema({
    title: String,
    image: String,
    info: String
});

var Cat = mongoose.model("cat", catSchema);

/* Cat.create({
    title: "BEER-BUNNY",
    image: "https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
    info: "Blue eyed cat portrait."
},function(err,cat){
    if(err){
        console.log("Error: " + err);
    }
    else{
        console.log("value Inserted::" + cat);
    }

}); */

//ROUTES

//Root route
app.get("/",function(req,res){
    res.redirect("/cats");
});

//Index route
app.get("/cats", function(req,res){

    Cat.find({},function(err,cats){
        if(err){
            console.log("Error occured while fetching from DB::"+ err);
        }
        else{
            res.render("index.ejs", {cats: cats})
        }
    });
});

//new route

app.get("/cats/new", function(req,res){

    res.render("new.ejs");
});

//post route
app.post("/cats",function(req,res){
    /* var titleValue = req.body.titlevalue;
    var imageValue = req.body.imagevalue;
    var infoValue = req.body.infovalue; */

    var newCat = {
        title: req.body.titlevalue,
        image: req.body.imagevalue,
        info: req.body.infovalue
    };

    Cat.create(newCat, function(err,cat){
        if(err){
            console.log("Error while inserting into DB::"+ err);
        }
        else{
            res.redirect("/cats");
        }
    });
});
//show route
app.get("/cats/:id", function(req,res){

    Cat.findById(req.params.id, function(err,cat){
        if(err){
            console.log("Error occured!"+ err);
        }
        else{
            res.render("show.ejs",{cat: cat});
        }
    });
    
});

//edit route

app.get("/cats/:id/edit", function(req,res){

    Cat.findById(req.params.id, function(err,cat){
        if(err){
            console.log("Error::"+ err);
        }
        else{

            res.render("edit.ejs",{cat: cat});
        }
    });

    
});

//update route
app.put("/cats/:id", function(req,res){

    Cat.findByIdAndUpdate(req.params.id, {title: req.body.titlevalue, image: req.body.imagevalue, info: req.body.infovalue},
        function(err,cat){
        if(err){
            console.log("Error while updating: "+ err);
            res.redirect("/cats");
        }
        else{

            res.redirect("/cats/"+req.params.id);

        }
    });
});

//destroy route
app.delete("/cats/:id", function(req,res){

    Cat.findByIdAndDelete(req.params.id, function(){
        res.redirect("/cats");
    });
    
});

//
app.listen(3000, function(){

    console.log("Running at localhost 3000");
});