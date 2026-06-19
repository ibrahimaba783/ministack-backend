const express = require('express');
const { inscription, connexion, getProfil } = require('../controllers/user.controller');
const auth = require('../middleware/user.middleware'); // ✅ ajouté

const router = express.Router();

router.post("/inscription", inscription);
router.post("/connexion", connexion);
router.get("/profil", auth, getProfil);

module.exports = router;