const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        titre: { type: String, required: true },
        description: { type: String, required: true },
        tags: [{ type: String }],
        auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        votes: { type: Number, default: 0 },
        vues: { type: Number, default: 0 },
        resolu: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema); 

