exports.waitLong = function(req, res) {
	console.log("Have to wait for "+req.query.timeout);
    setTimeout(function() {
		console.log("waited for "+req.query.timeout);
		res.send("ok");
    }, req.query.timeout);
};