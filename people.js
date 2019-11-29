"use strict"

//----------------------------------------------------------------
// PEOPLE LIST
const list = async function(r){
    let db = r._db;

    let results = await db.query('SELECT people.id, people.name, positions.name as position FROM people LEFT JOIN positions ON people.position=positions.id ORDER BY id');

    r.server.endWithSuccess(r,results);
}

//----------------------------------------------------------------
// ROUTER
exports.router = {
    $title: "load: API for Data Consumer",
    $descr: "Each server responce here contains last_sync_time. This value could be user in the next requests to get changes only.",
    list:{
        h_get:{
            title:"State",
            descr:"The peolple list",
            action: list
        }
    }
}
