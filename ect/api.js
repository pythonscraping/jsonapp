var express = require('express');

var jwt    = require('jsonwebtoken');
var api = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/test');

var User = require('./models/user.js');
var Openquestion = require('./models/question.js');
var Mutliplechoice = require('./models/multiplechoice.js');
var Rating = require('./models/rating.js');


var bodyParser = require('body-parser')
api.use(bodyParser)

api.post('/authenticate', function(req, res) {

	console.log(req.body);
  // find the user
  User.findOne({
    "local.email": req.body.email
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token with only our given payload
    // we don't want to pass in the entire user since that has the password
    const payload = {
      id: user._id 
    };
        var token = jwt.sign(payload, "unsecure", {
          expiresIn: "1h" // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   

    }

  });
});



api.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, "unsecure", function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });

  }
});


api.post('/test', function(req, res) {

  //res.send(req.decoded);

  User.findOne({_id: req.decoded.id}, function(err,user){
  	res.send(user);
  })

});



api.post('/answerquestions', function(req, res) {

        User.findById(req.decoded.id).lean().distinct('answers._id').exec(function(err, excluded) {
            
            //res.send(user);

            Mutliplechoice.find({_id : { $nin: excluded } },function(err,multiplechoicequestions){
        		res.json(multiplechoicequestions);
       		
       		});
            
        });
    
});



api.post('/generalinfo', function(req, res) {

       	var info = req.body;


        User.findById(req.decoded.id, function(err, user) {
            console.log(req.body);
            user.gender = info.gender;
            user.age = parseInt(info.age);
            user.minage = parseInt(info.minage);
            user.maxage = parseInt(info.maxage);

            user.save(function(err,updatedUser){
            	res.json(updatedUser);
            });
            
        });
    
});




api.post('/answermultiplechoice',function(req, res) {

	   var info = req.body;
	   Mutliplechoice.findOne({_id: info.questionid}).lean().exec(function(err,result){
	   	var userquestion = new Mutliplechoice();
	   	userquestion= result;
	   	var item = userquestion.answers.find(item => item._id == info.answer);
	   	item.selection=true;
	   	userquestion.isAnswered=true;

	   	User.findById(req.decoded.id, function(err, user) {
            console.log(req.body);
            user.answers.push(userquestion)
            user.save(function(err,updatedUser){
            	//res.send(updatedUser);
            	res.json("/answerquestions");
            });
            
        });
	   });
       
    
});
module.exports = api;