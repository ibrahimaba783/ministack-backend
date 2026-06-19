const mongoose = require('mongoose');


const connectBD = async () => {
     
    try {
         await mongoose.connect(process.env.MONGO_URL);
         console.log('MongoDB connecté ');
    } catch (error) {
        console.log('Erreur mongoBD');
        console.log('Erreur mongoBD' , error);
        process.exit(1);
        
    }

}

module.exports = connectBD ;