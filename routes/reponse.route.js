const express = require('express');
const { ajouterReponse, voterReponse, meilleureReponse, supprimerReponse, getReponses } = require('../controllers/reponse.controller');
const auth = require('../middleware/user.middleware');

const router = express.Router();


router.get('/:questionId', getReponses);
router.post('/:questionId', auth, ajouterReponse);
router.put('/:id/voter', auth, voterReponse);
router.put('/:id/meilleure', auth, meilleureReponse);
router.delete('/:id', auth, supprimerReponse);

module.exports = router;