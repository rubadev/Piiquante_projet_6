const jwt=require('jsonwebtoken')

function verification (req,res,next){
try{
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.verify(token,'RANDOM_TOKEN_SECRET')
    const userId = decodeToken.userId;
       req.sauce = {
           userId: userId
       };
}catch(error){
    res.status(401).json({error})
}

next()
}

module.exports = {verification}