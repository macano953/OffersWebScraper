var express = require('express');
var router = express.Router();
var os = require('os');

router.get('/charact', function(req, res, next) {
  res.status(200).jsonp({
  	hostname: os.hostname(),
  	type: os.type(),	
	platform: os.platform(),
	arch: os.arch(),
	release: os.release(),
	freemem: os.freemem(),
	totalmem: os.totalmem(),
	cpus: os.cpus(), 
	uptime: os.uptime(),
	networkInterfaces: os.networkInterfaces()
	});
});

module.exports = router;
