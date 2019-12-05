"use strict"

//----------------------------------------------------------------
// PEOPLE LIST
const list = async function(r){
    let db = r._db;

    let results = await db.query(
        'SELECT people.id, firstname, lastname, positions.name as position, positions.type as pos_type, phone, mail, birthday_year, birthday_month, birthday_day '+
        'FROM people '+
        'LEFT JOIN positions ON people.position_id=positions.id WHERE fired is NULL ORDER BY lastname');

    r.server.endWithSuccess(r,results);
}

//----------------------------------------------------------------
// ROUTER
exports.router = {
    $title: "People",
    $descr: "Load/modify people list",
    h_get:{
        title:"List",
        descr:"Select all not fired persons",
        action: list
    }
}
