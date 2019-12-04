const users = require('../users.json');

module.exports = username => {
  let result;
  console.log(username);
  for (i = 0; i < users["users"].length; ++i) {
  	if(users["users"][i].name === username)
    		result = true;  
  }
  return result;
};
	
