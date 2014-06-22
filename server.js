var express = require('express'),
    handler = require('./routes/handler');
 
var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.json());
	app.use(express.urlencoded());
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

// Port config
app.listen(3001);
console.log('Listening on port 3001...');