module.exports = {

    getWhiteListCount: function(){
        return getWhitelistCount();
    }

}

// Returns the number of whitelisted users..
function getWhitelistCount(){

    const RCON = require('rcon');
    const { rconPass, rconPort, rconHost } = require('../resources/config.json');
    let connection = new RCON(rconHost, rconPort, rconPass);

    return new Promise((resolve, reject) => {
        connection.on('auth', ()=> {  
            connection.send('/whitelist list')
        }).on('response', (res)=> {
            let response = '' + res;
            if(response.includes(',')){
                connection.disconnect();
                resolve(countCommas(response) + 1);
            } else {
                connection.disconnect();
                resolve(1);
            }

            connection.disconnect();
        });

        connection.connect();
    })
}

function countCommas(str){
    if(!str.includes(',')){
        return 0;
    } else {
        return 1 + countCommas(str.substring(str.indexOf(',')+1));
    }
}