// app/routes.js
module.exports = function(app, passport) {
/*var util = require('util');
res.send( util.inspect(res))*/
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		//res.render('home.ejs');
		res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.send({message: req.flash('loginMessage')}); 
		res.redirect('/')
		console.log('get a login');
	});

	// process the login form
	app.post('/login', function(req, res, next) {
	  passport.authenticate('local-login', function(err, user, info) {
	    if (err) {
	    	return next(err);
	    }
	    if (!user) {
	    	return res.send(400);
	    }
	    req.logIn(user, function(err) {
	      if (!err){
	      	return res.send(200);
	      }else{
	      	return res.send(err);
	      }
	      return next(err);
	      
	    });
	  })(req, res, next);
	});

		
	//

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.send({ message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '#/profile', // redirect to the secure profile section
		failureRedirect : '#/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.send( {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}