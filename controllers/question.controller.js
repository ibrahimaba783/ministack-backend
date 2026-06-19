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
exports.listeQuestions = async (req, res) => {
    try {
        const { tri, tag, recherche } = req.query; 
        let filtre = {}; 

        if (tag) filtre.tags = tag; 
        if (recherche) filtre.titre = { $regex: recherche, $options: 'i' }; 

        let sort = { createdAt: -1 }; 
        if (tri === 'votes') sort = { votes: -1 }; 

        const questions = await Question.find(filtre)
            .sort(sort)
            .populate('auteur', 'prenom nom'); 

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
exports.detailQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id) 
            .populate('auteur', 'prenom nom'); 
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
exports.voterQuestion = async (req, res) => {
    try {
        const { type } = req.body; 
        const question = await Question.findById(req.params.id); 
        if (!question) {
            return res.status(404).json({ message: "Question introuvable" });
        }
        question.votes += type === 'up' ? 1 : -1; 
        await question.save(); n
        res.json({ message: "Vote enregistré", votes: question.votes });
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};

// supprimer une question
exports.supprimerQuestion = async (req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.id); 
        res.json({ message: "Question supprimée" });
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};