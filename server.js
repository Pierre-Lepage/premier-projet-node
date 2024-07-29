const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config');

const app = express();
const port = 3000;

// Middleware pour le parsing des données de formulaire
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Servir les fichiers statiques depuis le répertoire public
app.use(express.static(path.join(__dirname, 'public')));

// Configurer EJS comme moteur de templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connexion à MongoDB avec Mongoose
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connecté !'))
  .catch(err => {
    console.error('Erreur de connexion à MongoDB :', err);
    process.exit(1);
  });

// Définir les schémas et modèles Mongoose
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const articleSchema = new mongoose.Schema({
  nom: String,
  codeArticle: String,
  description: String,
  image: String,
  prix: Number,
  quantite: Number,
});

const User = mongoose.model('User', userSchema);
const Article = mongoose.model('Article', articleSchema);

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Accueil' });
});

app.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

app.get('/create', (req, res) => {
  res.render('create', { title: 'Créer un article' });
});

app.get('/articles', (req, res) => {
  res.render('articles', { title: 'Liste des articles' });
});

app.get('/article/:codeArticle', (req, res) => {
  res.render('article', { title: 'Article' });
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    console.log('Utilisateur enregistré :', username);
    res.redirect('/login');
  } catch (err) {
    console.error('Erreur lors de l\'insertion de l\'utilisateur :', err);
    res.status(500).send('Erreur lors de l\'inscription');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (user) {
      console.log('Utilisateur connecté :', username);
      res.redirect('/articles');
    } else {
      console.log('Échec de la connexion pour :', username);
      res.status(401).send('Nom d\'utilisateur ou mot de passe incorrect');
    }
  } catch (err) {
    console.error('Erreur lors de la recherche de l\'utilisateur :', err);
    res.status(500).send('Erreur lors de la connexion');
  }
});

app.post('/create', async (req, res) => {
  const { nom, codeArticle, description, image, prix, quantite } = req.body;

  try {
    const newArticle = new Article({
      nom,
      codeArticle,
      description,
      image,
      prix: parseFloat(prix),
      quantite: parseInt(quantite, 10)
    });
    await newArticle.save();
    console.log('Article créé :', codeArticle);
    res.redirect('/articles');
  } catch (err) {
    console.error('Erreur lors de l\'insertion de l\'article :', err);
    res.status(500).send('Erreur lors de la création de l\'article');
  }
});

app.get('/api/articles', async (req, res) => {
  try {
    const articles = await Article.find({});
    res.json(articles);
  } catch (err) {
    console.error('Erreur lors de la récupération des articles :', err);
    res.status(500).send('Erreur lors de la récupération des articles');
  }
});

app.get('/api/article/:codeArticle', async (req, res) => {
  const codeArticle = req.params.codeArticle;

  try {
    const article = await Article.findOne({ codeArticle });
    if (article) {
      res.json(article);
    } else {
      res.status(404).send('Article non trouvé');
    }
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'article :', err);
    res.status(500).send('Erreur lors de la récupération de l\'article');
  }
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
