const Reponse = require('../models/reponse.model');
const Question = require('../models/question.model');

// Récupérer les réponses d'une question
exports.getReponses = async (req, res) => {
    try {
        const reponses = await Reponse.find({ question: req.params.questionId })
            .populate('auteur', 'prenom nom');
        res.json(reponses);
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};

// Ajouter une reponse
exports.ajouterReponse = async (req, res) => {
    try {
        const { contenu } = req.body;
        const reponse = await Reponse.create({
            contenu,
            auteur: req.user.id,
            question: req.params.questionId
        });
        res.status(201).json({ message: "Réponse ajoutée", reponse });
        console.log('reponse ajoutee');
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};

// Voter pour une reponse
exports.voterReponse = async (req, res) => {
    try {
        const { type } = req.body;
        const reponse = await Reponse.findById(req.params.id);
        if (!reponse) {
            return res.status(404).json({ message: "Réponse introuvable" });
        }
        reponse.votes += type === 'up' ? 1 : -1;
        await reponse.save();
        res.json({ message: "Vote enregistré", votes: reponse.votes });
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};

// Marquer comme meilleure reponse
exports.meilleureReponse = async (req, res) => {
    try {
        const reponse = await Reponse.findById(req.params.id);
        if (!reponse) {
            return res.status(404).json({ message: "Réponse introuvable" });
        }
        reponse.meilleure = true;
        await reponse.save();
        await Question.findByIdAndUpdate(reponse.question, { resolu: true });
        res.json({ message: "Meilleure réponse marquée" });
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};

// Supprimer une reponse
exports.supprimerReponse = async (req, res) => {
    try {
        await Reponse.findByIdAndDelete(req.params.id);
        res.json({ message: "Réponse supprimée" });
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};

// modifier une reponse (seulement par l'auteur)
exports.modifierReponse = async (req, res) => {
    try {
        const { contenu } = req.body;
        const reponse = await Reponse.findById(req.params.id);

        if (!reponse) {
            return res.status(404).json({ message: "Réponse introuvable" });
        }

        if (reponse.auteur.toString() !== req.user.id) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier cette réponse" });
        }

        reponse.contenu = contenu;
        await reponse.save();

        res.json({ message: "Réponse modifiée", reponse });
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};