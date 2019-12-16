"use strict"
const opuntia = require("opuntia");
const ApiError = opuntia.error.ApiError;
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

// var PORT = process.argv[2];
// if(!PORT) PORT = 80

//-------------------------------------------------------------------------------------------------
// CREATE & CONFIG API SERVER
var router = {
	// $title: "Public WEB server",
	// $descr: "Put intrasite-react/build here",
	// _files:	__dirname+'/build/',
	// _default:'index.html',
	// _404:	 'index.html', // for React router
	// h_get: 	opuntia.files.get,

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

// CREATE & START API SERVER
var server = new opuntia.Server(router, {
		PROTOCOL   	: 'http:',
		PORT       	: 8080
	}
);
server.listen(async function(){
	
	// Create db connection
	var database = new Database();
	await database.connect('intrasite');
	await scheme.verifyDatabase(database); // check/create tables
	router.api._db = database

	// START STATIC WEB SERVER
	var testUrl   = "http://localhost:"+server.config.PORT+"/doc";
	console.log("Open the next URL for test:\n"+testUrl);
});
