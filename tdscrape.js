var request = require('request');
var cheerio = require('cheerio');
var recipes = [];
var urls = [];

var scrapeTdUrl = function(uri){
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
	    var title = $("span#lblRecipeName").text();
	    if(title == undefined || title.trim() == ""){
	    	console.log("Title not found so quitting");
	    	return;
	    }
	    recipe.title = title;
	    recipe.url = options.url;
	    recipe.chef = "Tarla Dalal";
	    recipe.tags = [];
	    $("div#rcpinglist a").each(function(idx) {
	    	recipe.tags.push($(this).text().trim());
		});
		recipe.instructions = $("#rcpprocsteps li").text();
		if(recipe.instructions != undefined && recipe.instructions != ""){
			recipe.instructions = recipe.instructions.trim();
		}
	    console.log(JSON.stringify(recipe));
	    var data = JSON.stringify(recipe);
	    request.post({
		    uri		:"http://localhost:3001/recipe",
		    headers	:{'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data)},
		    body	:data,
		    timeout :2000
		    },function(err,res,body){
		    	if(err) {
		    		console.log("ERROR",err);
		    	} else {
		    		console.log("SUCCESS");
		    	}
			}
		);
	    recipes.push(recipe);
	});
};

var startId = 4028;
for(var i=0; i<2; i++){
	var id = startId + i;
	var url = "http://www.tarladalal.com/PrintRecipe.aspx?recipeid="+id;
	urls.push(url);
}

for(var j=0; j<2; j++){
	try{
		console.log("url", urls[j]);
		var t = 30000*j;
		// Invoke the function after time 't'
		(function(j, t) {
            setTimeout(function() {             
                scrapeTdUrl(urls[j]);
            }, t);
        })(j, t);
	} catch(e){
		console.error("Error", e);
	}
}