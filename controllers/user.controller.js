const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// la fonction d'inscription
exports.inscription = async (req, res) => {
    try {
        const { prenom, nom, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "utilisateur existe deja" });
        }

        const verifier = await bcrypt.genSalt(10);
        const hashagePassword = await bcrypt.hash(password, verifier);

        user = await User.create({
            prenom,
            nom,
            email,
            password: hashagePassword
        });

        res.status(201).json({ message: "Inscription réussie" });
        console.log('inscription reussi');

    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};

// fonction de connexion
exports.connexion = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Utilisateur introuvable' });
        }

        const correspond = await bcrypt.compare(password, user.password);
        if (!correspond) {
            return res.status(400).json({ message: 'mots de passe incorrect' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({
            token,
            user: {
                id: user._id,
                prenom: user.prenom,
                nom: user.nom,
                email: user.email
            }
        });
        console.log('connexion reussie');

    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};

// recuperer le profil de l'utilisateur connecte
exports.getProfil = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }

};

// uploader une photo de profil
exports.uploadPhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Aucun fichier envoyé" });
        }
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { photo: req.file.path }, // url complete cloudinary
            { new: true }
        ).select('-password');
        res.json({ message: "Photo mise à jour", user });
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};

// supprimer la photo de profil
exports.supprimerPhoto = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { photo: '' },
            { new: true }
        ).select('-password');
        res.json({ message: "Photo supprimée", user });
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};

