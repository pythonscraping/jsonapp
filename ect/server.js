var express = require('express');
var app = express();
var passport = require('passport');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var request = require('request');

var mongoose = require('mongoose');
var flash = require('connect-flash');


require('./config/passport')(passport); 
mongoose.connect('mongodb://127.0.0.1/eclectic');



const fileUpload = require('express-fileupload');
app.use(fileUpload());


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
        return next(); 
    }
    res.redirect('/login');
}


var User = require('./models/user.js');
var Openquestion = require('./models/question.js');
var Mutliplechoice = require('./models/multiplechoice.js');
var Rating = require('./models/rating.js');


module.exports = User;

var bodyParser = require('body-parser')
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));



app.use(require('express-session')({
    secret: 'sasdasdasdasdasdgasrgvranb25webfbvwcf',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.static(__dirname + '/music'));
app.use(express.static(__dirname + '/jsandcss'));
app.use(flash());
// VIEW ENGINE
app.set('view engine', 'jade');

var ObjectId = require('mongoose').Types.ObjectId;





app.get('/profile', ensureAuthenticated, function(req, res) {

        res.send(req.user)
    
});




app.get('/generalinfo', ensureAuthenticated, function(req, res) {

        res.render("generalinfo")
    
});


app.post('/generalinfo', ensureAuthenticated, function(req, res) {

       	var info = req.body;


        User.findById(req.user._id, function(err, user) {
            console.log(req.body);
            user.gender = info.gender;
            user.age = parseInt(info.age);
            user.minage = parseInt(info.minage);
            user.maxage = parseInt(info.maxage);

            user.save(function(err,updatedUser){
            	res.send(updatedUser);
            });
            
        });
    
});

app.post('/multiplechoice', ensureAuthenticated, function(req, res) {

       	var info = req.body;

       	var question = new Mutliplechoice({
        	name: info.name,
        	question: info.question,
        	isAnswered: false
    	});

    	for (var i = 0; i < info.answers.length; i++) {
    		question.answers.addToSet({answer: info.answers[i]});
    	}

    	question.save(function(err,newquestion){
    			res.send(newquestion);
    	});

       
    
});


app.post('/openquestion', ensureAuthenticated, function(req, res) {

       	var info = req.body;

       	res.send(info);
    
});


app.post('/ratingquestion', ensureAuthenticated, function(req, res) {

       	var info = req.body;

       	res.send(info);
    
});

app.get('/', ensureAuthenticated, function(req, res) {

        User.findById(req.user._id, function(err, docs) {
            
            res.render("home");
            
        });
    
});

app.get('/home', function(req, res) {

        res.render("home");
    
});

app.get('/signup', function(req, res) {

        res.render("signup");
    
});

app.get('/login', function(req, res) {

        res.render("login");
    
});


app.get('/answerquestions', ensureAuthenticated, function(req, res) {

        User.findById(req.user._id).lean().distinct('answers._id').exec(function(err, excluded) {
            
            //res.send(user);

            Mutliplechoice.find({_id : { $nin: excluded } },function(err,multiplechoicequestions){
        		res.render("answerquestions", {questions : multiplechoicequestions});
       		
       		});
            
        });
    
});


app.get('/answerquestions2', ensureAuthenticated, function(req, res) {

        Mutliplechoice.find({},function(err,multiplechoicequestions){
        	res.render("answerquestions", {questions : multiplechoicequestions});
        });
    
});


app.get('/users', function(req, res) {

        User.find({},function(err,users){
        	res.send(users);
        });
    
});


app.post('/answermultiplechoice', ensureAuthenticated, function(req, res) {

	   var info = req.body;
	   Mutliplechoice.findOne({_id: info.questionid}).lean().exec(function(err,result){
	   	var userquestion = new Mutliplechoice();
	   	userquestion= result;
	   	var item = userquestion.answers.find(item => item._id == info.answer);
	   	item.selection=true;
	   	userquestion.isAnswered=true;

	   	User.findById(req.user._id, function(err, user) {
            console.log(req.body);
            user.answers.push(userquestion)
            user.save(function(err,updatedUser){
            	//res.send(updatedUser);
            	res.redirect("/answerquestions");
            });
            
        });
	   });
       
    
});



app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

 app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));



//admin pages
var administration = require("./admin.js"); 
app.use("/admin", administration);   



app.listen(80);