const express = require('express');
const app = express();

const cors = require('cors');

const sauceRoutes = require('./routes/sauces');
const auth = require('./routes/auth');


//middleware
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/images', express.static(__dirname + '/images'));


// Authentification

app.use('/api/auth/', auth)

// route sauces
app.use('/api/sauces', sauceRoutes )


module.exports = app;