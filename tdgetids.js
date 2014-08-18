var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var urls = [];
var ids = [];

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

	    //console.log("names", $("span.rcc_recipename").children());
	    $("span.rcc_recipename a").each(function(idx) {
	    	var obj = {};
	    	obj.title = $(this).text();
	    	obj.href = $(this).attr('href');
	    	var a = $(this).attr('href');
	    	obj.id = a.substring(a.lastIndexOf("-")+1, a.length-1)
	    	if(parseInt(obj.id) != NaN){
	    		ids.push(obj);
	    	}
		});

		console.log(JSON.stringify(ids));

		var outputFilename = './content/td_thai.json';

		fs.writeFile(outputFilename, JSON.stringify(ids, null, 4), function(err) {
		    if(err) {
		      console.log(err);
		    } else {
		      console.log("JSON saved to " + outputFilename);
		    }
		}); 
	});
};

var startId = 1;
for(var i=0; i<10; i++){
	var id = startId + i;
	var url = "http://www.tarladalal.com/recipes-for-thai-87?pageindex="+id;
	urls.push(url);
}

for(var j=0; j<urls.length; j++){
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