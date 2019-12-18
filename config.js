// RELEASE MODE CONFIG
module.exports = {
    // Local dirs
	DIR_FRONTEND: '/Users/jenkins/intrasite/frontend/',
    DIR_FILES	: '/Users/jenkins/intrasite/files/',
    // SSL certificates
	HTTPS_KEY  	: '/Users/jenkins/intrasite/cert/hiqruprivate.key',
	HTTPS_CRT  	: '/Users/jenkins/intrasite/cert/hiqrupublic.crt',
    HTTPS_CA  	: '/Users/jenkins/intrasite/cert/intermediate.crt',
    // Database
	DATABASE : {  
		host: 	  "localhost",
		user: 	  "root",
		password: "223322" 
	}
}