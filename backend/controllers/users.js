const {User}= require('../mongs')
const bcrypt = require("bcrypt")
const jwt=require('jsonwebtoken')

//////////////signup
 async function createUser(req,res){
    const {email,password}= req.body

    const hashPassword = await hashPass(password)


    const user = new User({email,password:hashPassword})
    user.save()
       .then(() => res.status(201).json({ message: 'user enregistré !'}))
       .catch(error => res.status(409).json({ error }))
      
  }


  ///////////coder 
  function hashPass(password){
    const saltRound=10 
    return bcrypt.hash(password,saltRound) ;
  }

  ///////////login 
  function loginUser (req,res){
    const email = req.body.email
    const password=req.body.password
    User.findOne({ email: email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
        }
        bcrypt.compare(password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
  }
    

  module.exports= {createUser,loginUser}