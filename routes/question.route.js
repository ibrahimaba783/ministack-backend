const express = require('express');
const { creerQuestion, listeQuestions, detailQuestion, voterQuestion, supprimerQuestion } = require('../controllers/question.controller');
const auth = require('../middleware/user.middleware');

const router = express.Router();

router.get('/', listeQuestions);
router.get('/:id', detailQuestion);
router.post('/', auth, creerQuestion);
router.put('/:id/voter', auth, voterQuestion);
router.delete('/:id', auth, supprimerQuestion);

module.exports = router;