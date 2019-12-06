const users = require('../users.json');

module.exports = username => {
  let result = null;
  for (i = 0; i < users["users"].length; ++i) {
  	if(users["users"][i].name == username)
        return users["users"][i];
  }
  return result;
};
	
