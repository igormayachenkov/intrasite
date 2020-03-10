"use strict"

//--------------------------------------------------------------------
// AUTHENTICATION SYSTEM IMPLEMENTATION

const cookie 	= require('cookie');
const crypto 	= require('crypto');
const opuntia 	= require('opuntia');
const ApiError 	= opuntia.error.ApiError;
const scheme 	= require("./scheme.js");

//----------------------------------------------------------------------------
// SETTINGS
var settings={
	TOKEN_LENGTH	  : 16, // generated token length in bytes
	COOKIE_NAME       : 'token', 	// cookie for token name
	COOKIE_VALID_TIME : 31536000000// 365 days
};

//---------------------------------------------------------
// MAIN AUTH VERIFICATION FUNCTION
// To be called by opuntia framework
var checkAuthorized = async function(r){

	// Read token from cookie
	var token = null;
	if(r.request.headers.cookie) {
		//token = cookie.parse(r.request.headers.cookie)[settings.COOKIE_NAME];
		token = cookie.parse(r.request.headers.cookie)[settings.COOKIE_NAME];
		// var cookies = r.request.headers.cookie.split(';');
		// for(var i=0; i<cookies.length; i++){
		// 	var cookie = cookies[i];
		// 	if(cookie.indexOf(settings.COOKIE_NAME+"=")>=0){
		// 		token = cookie.slice(cookie.indexOf("=")+1);
		// 		break;
		// 	}
		// }
	}

	// VERIFY SESSION & DO NEXT WORK
	if(!token) throw new ApiError(401, "Unauthorized"); // No token in cookies or token is null
    // Find a session by the token
	let db = r._db;
	if(!db) throw new ApiError( 500, "database is undefined");
	let results = await db.query('SELECT * FROM sessions WHERE token="'+token+'"');
	let session = results[0];
    if(!session) throw new ApiError(401, "token not found"); 
    
	// SUCCESS: Add session to the route info
	r.session = session;
}
//----------------------------------------------------------------------------
// Common login/password verification
const verifyLogin = function(login){
	if(!login) throw "login is undefined";
	return login.trim();
}
const verifyPassword = function(password){
	if(!password) throw "password is undefined";
	return password.trim();
}


//----------------------------------------------------------------------------
// LOGIN
var login = async function(r){
	let db = r._db;
	// Verify data
	if(!r.data) 	 	 throw "the request data is empty";
	let email 	 = verifyLogin(r.data.email);
	let password = verifyPassword(r.data.password);

    if(email!='olga') throw new ApiError(401, "Authorization failed"); // Authorization failed

    // Find an object with the 'auth' property by login
    // let sql = 'SELECT * FROM auth WHERE login="'+login+'"';
    // let results = await db.query(sql);
    // let auth = results[0];
    // console.log("auth: ",auth);
    // if(!auth) throw new ApiError(401, "login not found"); // Authorization failed

	// VERIFY PASSWORD
	// if(!auth.salt){
	// 	// Old variant with open text passwords
	// 	if(auth.password !== password)
	// 		throw "Authorization failed";
	//  }else{
	// 	// Hashed password
	// 	var encrypted = encryptPassword(password, auth.salt);
	// 	if(auth.password !== encrypted)
	// 		throw "Authorization failed";
	// }
	
	// CREATE property 'SESSION' for the object
	// Prepare data,
	let token = crypto.randomBytes(settings.TOKEN_LENGTH).toString('hex');// Create random token
	var time = new Date().getTime();
    
    // Insert document
    let sql = 'INSERT INTO sessions VALUES ('+
                                '"'+token+'",'+
								'"'+email+'",'+ // user
                                    time+ // login time
                                ')';
    await db.query(sql);

	// Set cookie
	var dExp = new Date(time + settings.COOKIE_VALID_TIME);
	r.response.setHeader("Set-Cookie", settings.COOKIE_NAME+"="+token+"; Path="+getCookiePath(r)+"; Expires="+dExp.toString()+";");//Date format https://tools.ietf.org/html/rfc7231#section-7.1.1.2
	//r.response.setHeader("Set-Cookie", settings.COOKIE_NAME+"="+token+";Path=/;Expires="+dExp.toString()+";");//Date format https://tools.ietf.org/html/rfc7231#section-7.1.1.2

	// Send RESULT
	r.server.endWithSuccess(r, {
		token	: token,
        user	: email,
        time    : time
	});
}

//----------------------------------------------------------------------------
// LOGOUT 
// Clear cookie
var logout = async function(r){
	// Clear cookie
	r.response.setHeader("Set-Cookie", settings.COOKIE_NAME+"=empty;path="+getCookiePath(r)+";Max-Age=0;");

	// Send result
	r.server.endWithSuccess(r, {message:"logged out by user"});
}

//----------------------------------------------------------------------------
// Calculate auth path
// must be set:
// 		r.path
//		r.authLevel
var getCookiePath = function(r){
	var p = "";
	for(var i=0; i<r.authLevel; i++) 
		p += "/" + r.path.segments[i];
	if(i==0) p="/";
	//console.log("getCookiePath ",p);
	return p;
}

//----------------------------------------------------------------------------
// EXPORT
exports.checkAuthorized = checkAuthorized;
exports.router =	{
	login: {
		h_post:{
			title: "Authenticate with email/password",
			testBody: {email:"root", password:"root"},
			requestBodyType: "json",
			skipAuth:true, 
			action: login 
		}
	},
	logout: {
		h_get:{
			title: "Logout",
			descr: "Clear cookie on the client",
			skipAuth:true, 
			action: logout
		}
	}
}
