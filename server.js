var express = require('express'),
    handler = require('./routes/handler');
var port       = process.env.PORT || 3001; 
var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.json());
	app.use(express.urlencoded());
	app.use(function (error, req, res, next) {
	  if (!error) {
	    next();
	  } else {
	    console.error(error.stack);
	    console.log("sending error from use");
	    res.send(500);
	  }
	});
});
// All services are now CORS enabled
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

// Service end points
app.get('/testwait', handler.waitLong);

app.post('/recipe', handler.createRecipe);

// Port config
app.listen(port);
console.log('Listening on port '+port);