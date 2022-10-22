const getMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

function locationGenerator(username,coords){
    return{
      username,
      lat:coords.lat,
      lon:coords.lon,
      time: new Date().getTime()
    }
  }
  
  module.exports = {
    locationGenerator,
    getMessage
  };
