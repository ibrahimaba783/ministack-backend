const express = require('express');
const { creerQuestion, listeQuestions, detailQuestion, voterQuestion, supprimerQuestion, modifierQuestion } = require('../controllers/question.controller');
const auth = require('../middleware/user.middleware');

// middleware auth optionnel : si token present on decode, sinon on continue sans
const authOptional = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return next();
    auth(req, res, next);
};

const router = express.Router();

router.get('/', listeQuestions);
router.get('/:id', authOptional, detailQuestion); // auth optionnel pour les vues
router.post('/', auth, creerQuestion);
router.put('/:id/voter', auth, voterQuestion);
router.put('/:id', auth, modifierQuestion);
router.delete('/:id', auth, supprimerQuestion);

module.exports = router;