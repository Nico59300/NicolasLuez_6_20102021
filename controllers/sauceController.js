const fs = require('fs');
const Sauce = require('../models/Sauce');

exports.getOneSAuce = (req, res, next) => {

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {

            if (!sauce) {
                console.log("sauce non trouvée")
                res.status(404).json({ error: "sauce non trouvée" })
            }

            res.status(200).send(sauce)

        })
}

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => {
            res.status(200).send(sauces)
        }).catch(err => res.status(400).json({ error: err }))
}

exports.postSauce = (req, res, next) => {

    let name = req.file.originalname.split(' ').join('_').split('.')[0]
    const MIME_TYPES = {
        'image/jpg': 'jpg',
        'image/jpeg': 'jpg',
        'image/png': 'png'
    };
    let extension = MIME_TYPES[req.file.mimetype]
    let sauceToSave = new Sauce({
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${name}.${extension}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    console.log(sauceToSave)

    sauceToSave.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
        .catch(error => res.status(400).json({ error }));
}

exports.updateSauce = (req, res, next) => {

    Sauce.findOne({ _id: req.params.id })
        .then((sauce => {

            if (!sauce) {
                res.status(404).json({ error: 'sauce non trouvée' })
            }
            // controle userid loggué est bien le créateur de la sauce
            if (sauce.userId !== req.auth.userId) {
                console.log("userId not match")
                res.status(403).json({ error: "requête non autorisée" })
            }

            if (req.file) {
                // on normalise l'url du fichier
                let name = req.file.originalname.split(' ').join('_').split('.')[0];
                const MIME_TYPES = {
                    'image/jpg': 'jpg',
                    'image/jpeg': 'jpg',
                    'image/png': 'png'
                };
                let extension = MIME_TYPES[req.file.mimetype];

                newImgUrl = `${req.protocol}://${req.get('host')}/images/${name}.${extension}`;
                url2delete = sauce.imageUrl.split('000/')[1];
                // on supprime l'ancienne image
                fs.unlink(url2delete, (err) => {
                    if (err) throw err;
                    console.log('ancienne image supprimée');
                });
            }

            Sauce.updateOne({ _id: req.params.id },
                {
                    ...req.body,
                    imageUrl: req.file ? newImgUrl : Sauce.imageUrl
                })
                .then(() => {
                    res.status(200).json({ message: 'Sauce modifiée !' })
                })
                .catch(error => res.status(400).json({ error }));
        }))
}

exports.deleteSauce = (req, res, next) => {

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
           
            if (!sauce) {
                res.status(404).json({ error: 'sauce non trouvée' })
            }

            if (sauce.userId !== req.auth.userId) {
                console.log("userId not match")
                res.status(403).json({ error: "requête non autorisée" })
            }

            
            url2delete = sauce.imageUrl.split('000/')[1];
            // on supprime l'image associée
            fs.unlink(url2delete, (err) => {
                if (err) throw err;
                console.log('image sauce supprimée');
            });

            Sauce.deleteOne({ _id: req.params.id })
                .then(() => {
                    console.log(`url to delete : ${Sauce.imageUrl}`)
                    res.status(200).json({ message: 'sauce supprimé !' })
                })
                .catch(error => res.status(400).json({ error }));
        })
}

exports.likeSauce = (req, res, next) => {
    let userId = req.body.userId;
    let sauceId = req.params.id;
    let like = req.body.like;
    console.log("etat like " + like)
    let likes;
    let dislikes;
    let nblikes;
    let nbdislikes;
    // recupère les likes
    Sauce.findOne({ _id: sauceId }).then((sauce) => {
        likes = sauce.usersLiked;
        nblikes = sauce.likes;
        dislikes = sauce.usersDisliked;
        nbdislikes = sauce.dislikes;
    }).then(() => {
        console.log(nblikes)
        console.log(nbdislikes)
        switch (like) {
            case 1:
                if(likes.includes(userId)) {
                    break;
                }
                likes.push(userId)
                nblikes += 1
                break;
            case -1:
                if(likes.includes(userId)) {
                    break;
                }
                dislikes.push(userId)
                nbdislikes += 1
                break;
            case 0:
                if (likes.includes(userId)) {
                    likes.splice(userId, 1)
                    nblikes -= 1;
                } else if (dislikes.includes(userId)) {
                    dislikes.splice(userId, 1)
                    nbdislikes -= 1
                }
                break;
        }
    }).then(() => {
        Sauce.updateOne({ _id: sauceId }, {
            usersLiked: [...likes],
            likes: nblikes,
            usersDisliked: [...dislikes],
            dislikes: nbdislikes
        }).then(() => {
            res.status(200).json({ message: 'avis enregistré !' })
        })
    })
}
