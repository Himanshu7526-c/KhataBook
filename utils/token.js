const jwt = require('jsonwebtoken');

const generatetoken=(data)=>{

   return jwt.sign(data,process.env.JWT_SECRET_KEY);
}

module.exports=generatetoken;
