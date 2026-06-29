const Question = require('../models/question.model');
const Reponse = require('../models/reponse.model');

// creer une question
exports.creerQuestion = async (req, res) => {
    try {
        const { titre, description, tags } = req.body; 
        const question = await Question.create({
            titre,
            description,
            tags,
            auteur: req.user.id 
        });
        res.status(201).json({ message: "Question créée", question });
        console.log('question creee');
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};

// liste des questions
// supporte le filtrage par tag, par recherche texte sur le titre, et le tri (recent / votes / non resolus)
exports.listeQuestions = async (req, res) => {
    try {
        const { tri, tag, recherche } = req.query; 
        let filtre = {}; 

        if (tag) filtre.tags = tag; 
        if (recherche) filtre.titre = { $regex: recherche, $options: 'i' }; // recherche insensible a la casse

        let sort = { createdAt: -1 }; // par defaut : les plus recentes en premier
        if (tri === 'votes') sort = { votes: -1 }; // ou les plus votees en premier

        const questions = await Question.find(filtre)
            .sort(sort)
            .populate('auteur', 'prenom nom'); // remplace l'id auteur par ses infos (prenom, nom)

        const questionsAvecReponses = await Promise.all(
            questions.map(async (question) => {
                const nombreReponses = await Reponse.countDocuments({ question: question._id }); // compter les reponses
                return { ...question.toObject(), nombreReponses }; // ajouter nombreReponses a la question
            })
        );

        // filtrer les questions sans reponses si demande
        const resultat = tri === 'nonResolus'
            ? questionsAvecReponses.filter(q => q.nombreReponses === 0)
            : questionsAvecReponses;

        res.json(resultat);
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};

// detail d'une question
// chaque consultation incremente le compteur de vues
exports.detailQuestion = async (req, res) => {
    try {
        // findByIdAndUpdate + $inc : incremente la vue directement en base de donnees
        // (plus fiable que find() + save() si plusieurs personnes consultent en meme temps)
        const question = await Question.findByIdAndUpdate(
            req.params.id,
            { $inc: { vues: 1 } }, // +1 vue a chaque consultation
            { new: true } // renvoie le document mis a jour (avec la nouvelle valeur de vues)
        ).populate('auteur', 'prenom nom');

        if (!question) {
            return res.status(404).json({ message: "Question introuvable" });
        }
        res.json(question);
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};

// voter pour une question
// type "up" ajoute 1 vote, n'importe quelle autre valeur en retire 1
exports.voterQuestion = async (req, res) => {
    try {
        const { type } = req.body; 
        const question = await Question.findById(req.params.id); 
        if (!question) {
            return res.status(404).json({ message: "Question introuvable" });
        }
        question.votes += type === 'up' ? 1 : -1; 
        await question.save();
        res.json({ message: "Vote enregistré", votes: question.votes });
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};

// modifier une question
// seul l'auteur de la question peut la modifier
exports.modifierQuestion = async (req, res) => {
    try {
        const { titre, description, tags } = req.body;
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ message: "Question introuvable" });
        }

        // verification de securite : on compare l'auteur de la question (ObjectId -> string)
        // avec l'id de l'utilisateur connecte (recupere depuis le token JWT)
        if (question.auteur.toString() !== req.user.id) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier cette question" });
        }

        question.titre = titre;
        question.description = description;
        question.tags = tags;
        await question.save();

        res.json({ message: "Question modifiée", question });
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};

// supprimer une question
// seul l'auteur de la question peut la supprimer (meme verification que modifierQuestion)
exports.supprimerQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: "Question introuvable" });
        }

        // verification de securite : empeche un utilisateur de supprimer la question d'un autre
        if (question.auteur.toString() !== req.user.id) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer cette question" });
        }

        await Question.findByIdAndDelete(req.params.id);
        res.json({ message: "Question supprimée" });
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};