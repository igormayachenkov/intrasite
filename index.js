"use strict"
const fs 		= require("fs");
const opuntia 	= require("opuntia");
const ApiError 	= opuntia.error.ApiError;
const Database  = require("./database.js").Database;
const scheme    = require("./scheme.js");
const info  	= require("./info.js");
const people  	= require("./people.js");
const devices  	= require("./devices.js");
const gallery  	= require("./gallery.js");
const auth      = require("./auth.js");
const owner     = require("./owner.js");


// Production or Development?
const passphrase = process.env.PASSPHRASE; //process.argv[2];
const isProduction = passphrase?true:false;

//-------------------------------------------------------------------------------------------------
// LOAD CONFIG
if(isProduction){
	console.log('process.pid: ',process.pid);
	global.config = require("./config.js");
}else{
	global.config = require("./config-dev.js");
}

//-------------------------------------------------------------------------------------------------
// CREATE ROUTER
var router = {
	// Frontend WEB-server
	$title: "Frontend WEB-server",
	$descr: "Put intrasite-react/build here",
	_files:	config.DIR_FRONTEND,
	_default:'index.html',
	_404:	 'index.html', // for React router
	h_get: 	opuntia.files.get,

	// The router (for documentation server)
	router: {
		$title: "Rourer",
		$descr: "The endpoint to load the router for documentation tool",
		h_get : opuntia.Server.getRouterHandler()
	},
	// Documentation&Test WEB-server
	doc: 	{
		$title: "Documentation HTML-server",
		$descr: "To load static content",
		_files:	opuntia.getLocalPath()+'/doc/',
		_default:'index.html',
		h_get: 	opuntia.files.get
	},
	// API
	api:{
		_db    : null,// a database must be here
		people : people.router,
		devices: devices.router,
		gallery: gallery.router,
		private:{
			_auth   : auth,
			login   : auth.router.login,		
			logout  : auth.router.logout,		
			setOwner: owner.router.setOwner,		
			database: info.router.database
		}
	},
	// Files WEB-server
	files:{
		$title: "Files WEB server",
		$descr: "Photos and documents",
		_files: config.DIR_FILES,
		h_get: 	opuntia.files.get
	}
};

const startServer = (protocol, port, options)=>{
	var server = new opuntia.Server(router, {
		PROTOCOL   	: protocol,
		PORT       	: port
	});
	server.start(options, async function(){
		// Create database
		if(!config.DATABASE.database)
			config.DATABASE.database = 'intrasite'
		var database = new Database(config.DATABASE);
		router.api._db = database

		// Verify database
		try{
			await scheme.verifyDatabase(database); // check/create tables
		}catch(err){
			console.error("DATABASE TEST ERROR:",err);
			
		}

		// START STATIC WEB SERVER
		var testUrl   = protocol+"//localhost:"+server.config.PORT+"/doc";
		console.log("Open the next URL for test:\n"+testUrl);
	});
}

// CREATE & START API SERVER
if(isProduction){
	// Production
	if(!config.HTTPS_KEY || !config.HTTPS_CRT) 
		throw 'Error: config.HTTPS_KEY or config.HTTPS_CRT is undefined';
	// Load certificates from files
	var options = {
		passphrase:passphrase,
		key:  fs.readFileSync(config.HTTPS_KEY), 
		cert: fs.readFileSync(config.HTTPS_CRT)  
	};
	if(config.HTTPS_CA)
		options.ca = fs.readFileSync(config.HTTPS_CA)

	// To check production mode locally
	// var options = {
	// 	key:  fs.readFileSync("/home/igor/RESEARCH/certs/self/self.key"),
	// 	cert: fs.readFileSync("/home/igor/RESEARCH/certs/self/self.crt"),
	// 	passphrase: passphrase //"qwerty"
	// }
		
	// Start server
	startServer('https:', 443, options)
}else{
	console.log('DEVELOPMENT MODE')
	startServer('http:', 8080, null)
}
