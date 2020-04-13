var express = require("express");
var app = express();

//this serves the public folder for use.By default only views is served.
app.use(express.static('public'));

//used to fake POST request as PUT and DELETE. 
var methodOverride = require("method-override");
app.use(methodOverride('_method'));

//used to create the req.body object which helps in extracting the data from the form at server side.
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));


//used to sanitize the input . filter the malicious script tags.
var expressSanitizer = require("express-sanitizer");
app.use(expressSanitizer());

//MONGOOSE SETUP
var mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost/restblogapp", {useNewUrlParser: true, useUnifiedTopology: true });

var blogpostSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var blogPost = mongoose.model("blog",blogpostSchema);

/* blogPost.create({
    title: "Test blog",
    image:  "https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
    body: "Hello this a blog of doggy."
}, function(err,blog){
    if(err){
        console.log("error occured"+ err);
    }
    else{
        console.log("VALUE INSERTED");
    }
}); */

//ROUTES

//ROOT ROUTE
app.get("/", function(req,res){
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req,res){
    blogPost.find({}, function(err,blogs){
        if(err){
            console.log("ERROR OCCURED WHILE FETCHING DATA"+ err);
        }
        else{
            res.render("index.ejs", {blogs: blogs});
        }
    });
   
});

//NEW ROUTE
app.get("/blogs/new", function(req,res){
    res.render("new.ejs");
});

//CREATE ROUTE
app.post("/blogs", function(req,res){
    //FETCHING THE VALUES FROM THE FORM IN THE POST REQUEST
    var titleValue = req.sanitize(req.body.title);
    var imageValue = req.body.imagevalue;
    var bodyValue = req.sanitize(req.body.infovalue);

    

    //CREATING A NEW OBJECT FORM THE FETCHED VALUES
    var newBlog = {
        title: titleValue,
        image: imageValue,
        body: bodyValue
    };


    //SAVING THE NEW ENTRY(OBJECT) TO DATABASE

    blogPost.create(newBlog, function(err,blog){
        if(err){
            console.log("error occured"+ err);
        }
        else{
            console.log("VALUE INSERTED");  
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req,res){

    var id =req.params.id;
    

    blogPost.findById(id, function(err,blog){
        if(err){
            console.log("error occured"+ err);
        }
        else{
            res.render("show.ejs",{blog: blog});
        }
    });
    
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
    
    blogPost.findById(req.params.id, function(err,blog){
        if(err){
            console.log("Error occured"+ err);
            res.redirect("/blogs");
        }else{
            
            res.render("edit.ejs",{blog: blog});
        }
    });
});

//UPDATE ROUTE

app.put("/blogs/:id", function(req,res){
    blogPost.findByIdAndUpdate(req.params.id, {"title": req.sanitize(req.body.title),"image": req.body.imagevalue, "body": req.sanitize(req.body.infovalue)},
     function(err,updatedBlog){

        if(err){
            res.redirect("/blogs");
        }
        else{
            
            res.redirect("/blogs/"+ req.params.id);
        }
    });
});

//REMOVE ROUTE

app.delete("/blogs/:id", function(req,res){
    blogPost.findByIdAndDelete(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});

app.listen(3000,function(){

    console.log("running at 3000");
});