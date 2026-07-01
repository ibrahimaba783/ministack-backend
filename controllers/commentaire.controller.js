const Commentaire = require('../models/commentaire.model');

// Ajouter un commentaire
exports.ajouterCommentaire = async (req, res) => {
    try {
        const { contenu } = req.body;
        const commentaire = await Commentaire.create({
            contenu,
            auteur: req.user.id,
            reponse: req.params.reponseId
        });
        res.status(201).json({ message: "Commentaire ajouté", commentaire });
        console.log('commentaire ajoute');
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};

// Supprimer un commentaire
exports.supprimerCommentaire = async (req, res) => {
    try {
        await Commentaire.findByIdAndDelete(req.params.id);
        res.json({ message: "Commentaire supprimé" });
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};

// recuperer les commentaires d'une reponse
exports.getCommentaires = async (req, res) => {
    try {
        const commentaires = await Commentaire.find({ reponse: req.params.reponseId })
            .populate('auteur', 'prenom nom');
        res.json(commentaires);
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};