const mongoose = require('mongoose');
require('dotenv').config();

class Database {
  constructor(){
    
  }

   async connect() {
    return  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/spicy",
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