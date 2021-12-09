const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');

exports.signup = (req, res, next) => {
    User.findOne({ email: req.body.email }).then((user) => {
        if (user) {
            console.log("L'email est déjà enregistré")
            res.status(400).send({ message: "L'email est déjà enregistré" })
        } else {
            bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    const newUser = new User({
                        email: req.body.email,
                        password: hash
                    });
                    console.log("new user : " + newUser)
                    newUser.save()
                        .then(() => { res.send({ message: "utilisateur enregistré" }) })
                })
        }
    })
};

exports.login = (req, res, next) => {

    // on recherche le user en db
    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            console.log("email inconnu")
            res.status(401).json({ message: "email inconnu" })
        } else {
            bcrypt.compare(req.body.password, user.password).then((valid) => {
                    if (!valid) {
                        console.log("mauvais password")
                        res.status(401).json({ message: 'Mot de passe incorrect !' });
                    } else {
                        res.status(200).send({
                            userId: user._id,
                            token: jwt.sign(
                                { userId: user._id },
                                process.env.JWT_SECRET || 'RANDOM_TOKEN_SECRET',
                                { expiresIn: '24h' }
                            )
                        })
                    }
                })
        }
    })
}