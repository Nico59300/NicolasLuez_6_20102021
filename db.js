const mongoose = require('mongoose');

class Database {
  constructor(){
    
  }

   async connect() {
    return  await mongoose.connect('mongodb+srv://pampa:euI9WXvYjZlMgVjj@spicy.jt95g.mongodb.net/spicy?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  }

  async close() {
    return await mongoose.connection.close()
    .then(() => console.log('Déconnecté de MongoDB'))
  }
}


const db = new Database();
module.exports = db;