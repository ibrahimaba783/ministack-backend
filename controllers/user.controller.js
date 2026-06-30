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
            { photo: req.file.path }, 
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

// modifier les infos du profil (prenom, nom, email)
exports.modifierProfil = async (req, res) => {
    try {
        const { prenom, nom, email } = req.body;

        // si l'email change, verifier qu'il n'est pas deja utilise par quelqu'un d'autre
        if (email) {
            const emailExistant = await User.findOne({ email, _id: { $ne: req.user.id } });
            if (emailExistant) {
                return res.status(400).json({ message: "Cet email est déjà utilisé" });
            }
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { prenom, nom, email },
            { new: true }
        ).select('-password');

        res.json({ message: "Profil mis à jour", user });
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};

// changer le mot de passe
exports.changerMotDePasse = async (req, res) => {
    try {
        const { ancienMotDePasse, nouveauMotDePasse } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        // verifier l'ancien mot de passe avant d'autoriser le changement
        const correspond = await bcrypt.compare(ancienMotDePasse, user.password);
        if (!correspond) {
            return res.status(400).json({ message: "Ancien mot de passe incorrect" });
        }

        const verifier = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(nouveauMotDePasse, verifier);
        await user.save();

        res.json({ message: "Mot de passe modifié avec succès" });
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};