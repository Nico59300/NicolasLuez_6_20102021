const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');

exports.signup = (req, res, next) => {
    User.findOne({email : req.body.email}).then((user) => {
        if(user) {
            console.log("L'email est déjà enregistré")
            res.status(500).send({error : "L'email est déjà enregistré"})
        }else {
            bcrypt.hash(req.body.password, 10)
            .then( hash => {
                const newUser = new User({
                    email: req.body.email,
                    password : hash
                });
                console.log("new user : " + newUser)
                newUser.save()
                    .then(() => {res.send({message: "utilisateur enregistré"})})  
            })
        }
    })
  };

exports.login = (req, res, next) => {

    // on recherche le user en db
    User.findOne({ email: req.body.email }).then(user => {

        if(user) {
            
            bcrypt.compare(req.body.password, user.password)
            .then((valid) => {
                if(!valid) {
                    console.log("mauvais password")
                    return res.status(401).json({ error: 'Mot de passe incorrect !' });
                }
                res.status(200).send({
                    userId: user._id,
                   token: jwt.sign(
                        { userId: user._id },
                        process.env.JWT_SECRET || 'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                      )
                })
                
            })
        }else {
            console.log("email inconnu")
            res.status(401).send({ error : "email inconnu"});
        }
    })
        
}