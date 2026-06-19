const mongoose = require("mongoose");

const reponseSchema = new mongoose.Schema(
    {
        contenu: { type: String, required: true },
        auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
        votes: { type: Number, default: 0 },
        meilleure: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Reponse', reponseSchema);