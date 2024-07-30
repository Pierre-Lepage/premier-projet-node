const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  codeArticle: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  prix: { type: Number, required: true },
  quantite: { type: Number, required: true },
  categorie: { type: String, required: true }, // Nouvelle propriété pour la catégorie
}, { timestamps: true });

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
