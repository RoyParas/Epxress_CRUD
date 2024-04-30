const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const validateToken = asyncHandler(async(req,res,next) =>{
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (!authHeader) {
        res.status(401);
        throw new Error("Authourization Header is missing!");
    }
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.access_token_secret,(err,decoded) => {
        if(err) {
            res.status(401);
            throw new Error("User is not Authorized or Token has expired");
        }
        req.user = decoded.user;
        next();
    })
    if (!token) {
        res.status(401);
        throw new Error("User is not Authorized or token is missing");
    }
}) 

module.exports = validateToken;
