const mongoose = require("mongoose");

const commentaireSchema = new mongoose.Schema(
    {
        contenu: { type: String, required: true },
        auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        reponse: { type: mongoose.Schema.Types.ObjectId, ref: 'Reponse', required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Commentaire', commentaireSchema);