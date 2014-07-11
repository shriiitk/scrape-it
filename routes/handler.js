var log4js = require('log4js');
log4js.configure('my_log4js_configuration.json', { reloadSecs: 60 });
var logger = log4js.getLogger('scrape-it');

var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost');
mongoose.connect('mongodb://cookoousr:cookoousr1$@ds045089.mongolab.com:45089/cookoo');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log("Connected to DB");
});

var recipeSchema = mongoose.Schema({
    title	: { type: String, required: true, unique: true, trim: true, uppercase: true },
    tags	: [String],
    url		: String,
    video	: String,
    chef	: String,
    instructions	: String,
    createdOn		: Date,
    modifiedOn		: Date,
});
var Recipe = mongoose.model('Recipe', recipeSchema);

var tagsSchema = mongoose.Schema({
    title	: { type: String, required: true, unique: true, trim: true, uppercase: true }
});
var Tag = mongoose.model('Tag', tagsSchema);

exports.waitLong = function(req, res) {
	console.log("Have to wait for "+req.query.timeout);
    setTimeout(function() {
		console.log("waited for "+req.query.timeout);
		res.send("ok");
    }, req.query.timeout);
};

exports.createRecipe = function(req, res){
	// logger.debug(req.body);
	// logger.debug(req.body.tags);
	var o = new Recipe(req.body);
	logger.debug(o.title);
	o.save(function (err, o) {
	  if (err) {
	  	logger.error(err);
	  	console.log(" Recipe save error");
	  	res.send(500, err);
	  } else {
	  	var tags = req.body.tags;
		var len = tags.length;
		for(var i=0; i<len; i++){
			var tag = new Tag({title : tags[i]});
			tag.save(function (err, o) {
			  	if (err && (11000 === err.code || 11001 === err.code)) { 
					logger.error(err);
			  	}
			  	if(err) {
			  		console.log("tag save error", err);
			  	} else {
			  		console.log("tag save success");
			  	}
			});
		}
		res.send(201);
	  }
	});
	
	
};
