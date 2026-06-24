const express = require('express');
const { inscription, connexion, getProfil, uploadPhoto, supprimerPhoto, supprimerQuestion, modifierQuestion } = require('../controllers/user.controller');
const auth = require('../middleware/user.middleware'); 
const upload = require('../middleware/upload.middleware');

const router = express.Router();

router.post("/inscription", inscription);
router.post("/connexion", connexion);
router.get("/profil", auth, getProfil);
router.post("/photo", auth, upload.single('photo'), uploadPhoto);
router.put("/photo/supprimer", auth, supprimerPhoto);
router.put('/:id', auth, modifierQuestion);
router.delete('/:id', auth, supprimerQuestion)

module.exports = router;