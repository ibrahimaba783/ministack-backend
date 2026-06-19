const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const connectBD = require("./config/db");
const userRoute = require('./routes/user.route')
const questionRoute = require('./routes/question.route')
const reponseRoute = require('./routes/reponse.route')
const commentaireRoute = require('./routes/commentaire.route')

dotenv.config()
const app = express();
connectBD();
app.use(express.json());
app.use(cors({ origin: "*"}));
const PORT = process.env.PORT;
app.listen( PORT , () => {
    console.log(`serveur démarré sur http://localhost:${PORT}` );
})

// ---------------les routes ----------

app.get('/' , (req , res) => {
    res.send('Bienvenue sur mon serveur')
})

// inscription et connexion
app.use('/api/auth', userRoute);

// questions
app.use('/api/questions', questionRoute);

// reponses
app.use('/api/reponses', reponseRoute);

// commentaires
app.use('/api/commentaires', commentaireRoute);