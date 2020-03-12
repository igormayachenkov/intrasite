"use strict"


//----------------------------------------------------------------------------
// LOGIN
var setOwner = async function(r){
	let db = r._db;
	// Verify data
	if(!r.data)          throw "the request data is empty";
	if(!r.data.device_id)throw "device_id is empty";
	let time = new Date().getTime();

    // Insert document
    let sql = 'INSERT INTO owners VALUES ('+
                                time+','+
								r.data.device_id+','+ 
                                (r.data.user_id?r.data.user_id:'NULL')+
                                ')';
    await db.query(sql);

	// Send RESULT
	r.server.endWithSuccess(r, {
        time    : time
	});
}

//----------------------------------------------------------------------------
// EXPORT
exports.router =	{
	setOwner: {
		h_post:{
			title: "Set/clear owner for a device",
			testBody: {device_id:1, user_id:null},
			requestBodyType: "json",
			action: setOwner 
		}
	}
}
