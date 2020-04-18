var express = require("express");
var app = express();

app.use(express.static("public"));

//body-parser to extract data from the form.
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var methodOverride = require("method-override");
app.use(methodOverride('_method'));

//DATABASE SETUP
var mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost/foodBlogApp",{useNewUrlParser: true, useUnifiedTopology: true});

var foodSchema = new mongoose.Schema({
    name: String,
    image: String,
    info: String
});

var Food = mongoose.model("food", foodSchema);


//Routes
//ROOT ROUTE
app.get("/", function(req,res){
    res.redirect("/foods");
}); 

//INDEX ROUTE
app.get("/foods", function(req,res){
    Food.find({}, function(err,allFoodItems){
        if(err){
            console.log("error while fetching from DB:"+ err);
            res.redirect("/foods");
        }
        else{
            res.render("index.ejs",{foodItems: allFoodItems});
        }
    });
});

//NEW ROUTE
app.get("/foods/new", function(req,res){

    res.render("new.ejs");
});

//POST ROUTE
app.post("/foods", function(req,res){
    var newFood = {
        name: req.body.namevalue,
        image: req.body.imagevalue,
        info: req.body.infovalue
    };
    Food.create(newFood, function(err,food){
        if(err){
            console.log("error occured while inserting data:: "+ err);
            res.redirect("/foods");
        }
        else{
            console.log("value inserted");
            res.redirect("/foods");
        }
    });
});

//SHOW ROUTE
app.get("/foods/:id", function(req,res){

    Food.findById(req.params.id, function(err, item){
        if(err){
            console.log("error while fetching info from DB:"+ err);
        }
        else{
            res.render("show.ejs",{foodItem: item});
        }
    });
});

//EDIT ROUTE
app.get("/foods/:id/edit", function(req,res){
    //find the details from the db and then populate the form with the data.
    Food.findById(req.params.id, function(err, foodItem){
        if(err){
            console.log("error occured "+err);
            res.redirect("/foods");
        }
        else{
            res.render("edit.ejs",{foodItem: foodItem});
        }
    });
    
});
//UPDATE ROUTE
app.put("/foods/:id", function(req,res){
    //find the particular entry and update the data

    Food.findByIdAndUpdate(req.params.id, {name: req.body.namevalue, image: req.body.imagevalue, info: req.body.infovalue},
        function(err,fooditem){
            if(err){
                console.log("unable to update the info"+ err);
                res.redirect("/foods");
            }
            else{
                res.redirect("/foods/"+req.params.id);
            }
        });
});

//DELETE ROUTE
app.delete("/foods/:id", function(req,res){
    //find the item in db and then delete it.
    Food.findByIdAndDelete(req.params.id, function(err){
        if(err){
            console.log("error occured while deleting"+ err);
            res.redirect("/foods");
        }
        else{
            res.redirect("/foods");
        }
    })
});

//server setup
app.listen(3000, function(){

    console.log("UP and Running at 3000");
});
