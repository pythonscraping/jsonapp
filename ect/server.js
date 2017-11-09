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
            	//res.send(updatedUser);
                res.redirect("/home");
            });
            
        });
    
});

app.post('/favorites', ensureAuthenticated, function(req, res) {

        var info = req.body;
        console.log(info);

        User.findById(req.user._id, function(err, user) {
            user.favorites = info.favorites;
            user.save(function(err,updatedUser){
                //res.send(updatedUser);
                res.redirect("/home");
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

app.get('/home', ensureAuthenticated,function(req, res) {

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


app.get('/users', ensureAuthenticated, function(req, res) {

        User.find({},function(err,users){
        	res.send(users);
        });
    
});

app.get('/match2', ensureAuthenticated, function(req, res) {

        User.find({},function(err,users){
            res.render("match", {users : users});
        });
    
});


var compareAnsswers = function(original,otheruser){
    var commonanswers = 0;
    var differentanswers = 0;
    for (var i = 0; i < original.length; i++) {
        if (original[i].isAnswered){
            var idd = original[i]._id;
            console.log("something");
            for (var j = 0; j < otheruser.length; j++) {
                //console.log(typeof otheruser[j]._id);
                //console.log(typeof idd);
                if (idd.toString() === otheruser[j]._id.toString()){
                    for (var z = 0; z < original[i].answers.length; z++) {
                        var tobeTested = original[i].answers[z];
                        if(tobeTested.selection){
                            console.log(tobeTested.answer);
                            for (var w = 0; w < otheruser[j].answers.length; w++) {
                                var tocompareWith =  otheruser[j].answers[w];
                                if(tobeTested._id.toString()==tocompareWith._id.toString()){
                                    if(tobeTested.selection==tocompareWith.selection){
                                        //console.log("Same answers");
                                        commonanswers++;
                                    }
                                    else {
                                        //console.log("differentanswers");
                                        differentanswers++;
                                    }
                                }

                            }
                        }
                    }
                }
            }
        }
        

    }
    console.log("compatibility :");
    var compatibility = commonanswers / (commonanswers+differentanswers);
    console.log(compatibility*100);
    return compatibility;
}

app.get('/match', ensureAuthenticated,function(req, res) {

        User.findById(req.user._id, function(err, user) {
        console.log("user found");
        User.find({ age : { $gte :  req.user.minage, $lte : req.user.maxage},
                    maxage: { $gte :  req.user.age},
                    minage: { $lte :  req.user.age}}).limit(20).lean().exec(function(err,users){
            for (var i = 0; i < users.length; i++) {
                users[i].compatibility = (compareAnsswers(user.answers,users[i].answers)*100).toFixed(2);
            }
            res.render("match", {users : users.sort((a, b) => a.compatibility < b.compatibility)});
        });

    });
    
});

app.get('/picktime', function(req, res) {
        
        res.render("picktime");
    
});


app.post('/picktime', function(req, res) {
        console.log(req.body);
        
        info = req.body;

        User.findById(req.user._id, function(err, user) {
            console.log(req.body);
            user.from = info.from;
            user.todate = info.todate;


            user.save(function(err,updatedUser){
                //res.send(updatedUser);
                res.send(req.updatedUser);
            });
            
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



var apii = require("./api.js"); 
app.use("/api", apii); 


app.listen(3000);