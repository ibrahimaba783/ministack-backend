const express = require('express');
const { ajouterCommentaire, supprimerCommentaire } = require('../controllers/commentaire.controller');
const auth = require('../middleware/user.middleware');

const router = express.Router();

router.post('/:reponseId', auth, ajouterCommentaire);
router.delete('/:id', auth, supprimerCommentaire);

module.exports = router;