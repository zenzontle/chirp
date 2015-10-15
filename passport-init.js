var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');

module.exports = function(passport) {

	//Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done) {
		console.log('serializing user:', user.username);
		return done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		console.log('deserializing user:', id);
		User.findById(id, function(err, user) {
			if (err) {
				return done(err, false);
			}
			if (!user) {
				return done('User not found', false);
			}

			//we found the user object provide it back to passport
			return done(err, user);
		});
	});

	passport.use('login', new LocalStrategy({
		passReqToCallback : true
	},
	function(req, username, password, done) {

		User.findOne({'username': username}, function(err, user) {
			if (err) {
				return done(err), false;
			}
			if (!user) {
				console.log('User not found with username: ' + username);
				return done('user not found', false);
			}
			if (!isValidPassword(user, password)) {
				console.log('Invalid password ' + username);
				return done('Invalid password', false);
			}

			//successfully signed in
			console.log('successfully signed in');
			return done(null, user);
		});
	}));

	passport.use('signup', new LocalStrategy({
		passReqToCallback : true //allows us to pass back the entire request to the callback
	},
	function(req, username, password, done) {

		User.findOne({'username': username }, function(err, user) {
			if (err) {
				console.log('Error in SignUp: ' + err);
				return done(err, false);
			}

			if (user) {
				//we have already signed this user up
				console.log('Username already taken ' + username);
				return done(null, false);
			} else {
				console.log('Creating new user ' + username);

				var newUser = new User();
				newUser.username = username;
				newUser.password = createHash(password);

				newUser.save(function(err) {
					if (err) {
						console.log('Error in Saving user:' + err);
						throw err;
					}
					console.log(newUser.username + ' Registration successful');
					return done(null, newUser);
				});
			}
		});
	}));

	var isValidPassword = function(user, password) {
		return bCrypt.compareSync(password, user.password);
	};
	//Generates hash using bCrypt
	var createHash = function(password) {
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};
};