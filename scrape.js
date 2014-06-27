var fs = require('fs');
var xml2js = require('xml2js');
var request = require('request');
var cheerio = require('cheerio');
var recipes = [];

var scrapeUrl = function(uri){
	console.log("Starting on "+uri);
	var options = {
	    url: uri+'',
	    timeout: 20000
	};
	request(options, function(err, resp, body) {
		console.log(new Date());
		var recipe = {};
	    if (err){
	    	console.error("Error occured",err);
	    	throw err;
	    }
	        
	    $ = cheerio.load(body);
	    // All the parsing and customs actions after this
	    recipe.title = $(".video-name").text();
	    recipe.tags = [];
	    recipe.url = options.url;
	    $(".table-striped td.name").each(function(idx) {
	    	recipe.tags.push($(this).text().trim());
		});
		recipe.instructions = $(".directions-content").text().trim();
		recipe.video = $("object").attr("data").trim();
	    console.log(JSON.stringify(recipe.tags));
	    
	    request.post({
		    uri		:"http://localhost:3001/recipe",
		    headers	:{'content-type': 'application/json'},
		    body	:JSON.stringify(recipe)
		    },function(err,res,body){
		        console.log(body);
		});
	    recipes.push(recipe);
	});
};

var parser = new xml2js.Parser();
parser.addListener('end', function(result) {
	console.log(result.urlset.url.length);
	var urls = result.urlset.url;
	var len = urls.length;
	for(var i=0; i<len; i++){
		console.log(urls[i].changefreq + " - " + urls[i].loc);
		if(urls[i].changefreq == "monthly"){
			try{
				var t = 30000*i;
				// Invoke the function after time 't'
				(function(i, t) {
		            setTimeout(function() {             
		                scrapeUrl(urls[i].loc);
		            }, t);
		        })(i, t);
			} catch(e){
				console.error("Error", e);
			}
			
		}
	}
    console.log('Done.');
});

// location of sitemap xml
fs.readFile(__dirname + '/../small.xml', function(err, data) {
    parser.parseString(data);
});



