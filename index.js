"use strict"
const fs 		= require("fs");
const opuntia 	= require("opuntia");
const ApiError 	= opuntia.error.ApiError;
const Database  = require("./database.js");
const scheme    = require("./scheme.js");
const info  	= require("./info.js");
const people  	= require("./people.js");
const devices  	= require("./devices.js");
const gallery  	= require("./gallery.js");


global.config = {
	DATABASE : {  
		host: 	  "localhost",
		user: 	  "root",
		password: "223322" 
	}
};

//-------------------------------------------------------------------------------------------------
// CREATE & CONFIG API SERVER
var router = {
	$title: "Public WEB server",
	$descr: "Put intrasite-react/build here",
	_files:	__dirname+'/build/',
	_default:'index.html',
	_404:	 'index.html', // for React router
	h_get: 	opuntia.files.get,

	// The router
	router: {
		$title: "Rourer",
		$descr: "The endpoint to load the router for documentation tool",
		h_get : opuntia.Server.getRouterHandler()
	},
	// HTML server
	doc: 	{
		$title: "Documentation HTML-server",
		$descr: "To load static content",
		_files:	opuntia.getLocalPath()+'/doc/',
		_default:'index.html',
		h_get: 	opuntia.files.get
	},
	api:{
		_db    : null,// a database must be here
		info   : info.router,
		people : people.router,
		devices: devices.router,
		gallery: gallery.router
	},
	files:{
		$title: "Files",
		$descr: "Photos and documents",
		_files: __dirname+'/files/',
		h_get: 	opuntia.files.get
	}
};

const startServer = (protocol, port, options)=>{
	var server = new opuntia.Server(router, {
		PROTOCOL   	: protocol,
		PORT       	: port
	});
	server.start(options, async function(){
		// Create db connection
		var database = new Database();
		await database.connect('intrasite');
		await scheme.verifyDatabase(database); // check/create tables
		router.api._db = database

		// START STATIC WEB SERVER
		var testUrl   = protocol+"//localhost:"+server.config.PORT+"/doc";
		console.log("Open the next URL for test:\n"+testUrl);
	});
}

// CREATE & START API SERVER
// Release or Development?
if(process.argv[2]=='dev'){
	console.log('DEVELOPMENT MODE')
	startServer('http:', 8080, null)
}else{
	// RELEASE
	// Load config
	const config = require("./config.js");
	if(!config.HTTPS_KEY || !config.HTTPS_CRT) 
		throw 'Error: config.HTTPS_KEY or config.HTTPS_CRT is undefined';

	// Load certificates from files
	var options = {
		key:  fs.readFileSync(config.HTTPS_KEY), //'private-key.pem'),
		cert: fs.readFileSync(config.HTTPS_CRT)  //'certificate.pem')
	};
	if(config.HTTPS_CA)
		options.ca = fs.readFileSync(config.HTTPS_CA)
	
	// Input the pathphrase	
	var readline = require('readline');// https://nodejs.org/api/readline.html
	var rl = readline.createInterface({
		input : process.stdin,
		output: process.stdout
	});
	console.log('Input the RSA-key passphrase:');
	rl.on('line', function(line){
		rl.close();
		// Start server
		options.passphrase = line;
		startServer('https:', 8080, options)
	})
}
