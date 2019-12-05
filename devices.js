"use strict"

//----------------------------------------------------------------
// DEVICES LIST

const maxtimes = 'SELECT device_id, max(time) as tmax FROM owners GROUP BY device_id';// max owner times foe devices
const lastOwners = 'SELECT owners.* FROM owners RIGHT JOIN ('+maxtimes+') as maxtimes ON owners.time=maxtimes.tmax AND owners.device_id=maxtimes.device_id'
const devicesWithOwnerId = 'SELECT devices.*, time, user_id FROM devices left JOIN ('+lastOwners+') AS last_owners ON id=last_owners.device_id'

const list = async function(r){
    let db = r._db;

    // Make USERs REFS
    let usersArray = await db.query('SELECT * FROM people');
    let users={}
    usersArray.forEach(user => {
        users[user.id] = user;
    });

    // Select devices
    let devices = await db.query(
        devicesWithOwnerId
    );

    // Add owners
    devices.forEach(device=>{
        device.owner = device.user_id ? users[device.user_id] : null;
        delete device.user_id;        
    })

    r.server.endWithSuccess(r,devices);
}

//----------------------------------------------------------------
// ROUTER
exports.router = {
    $title: "Devices",
    $descr: "Load/modify devices list",
    h_get:{
        title:"List",
        descr:"Select all devices with owners",
        action: list
    }
}
