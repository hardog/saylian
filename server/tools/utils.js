const crypto = require('crypto');


module.exports = {
  md5: (text, lower) => {
    const str = crypto.createHash('md5')
                   .update(text)
                   .digest('hex')
                   .slice(0, 32);

    if(lower){
      return str.toLowerCase();
    }
    
    return str.toUpperCase();
  }
};