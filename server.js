const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
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

// Configuration des sessions
app.use(session({
    secret: 'votre_secret',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

// Middleware pour vérifier si l'utilisateur est authentifié
function ensureAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Middleware pour rendre les messages flash disponibles dans les vues
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.session.user;
    next();
});

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
app.get('/', ensureAuthenticated, (req, res) => {
  res.render('index', { title: 'Accueil' });
});

app.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

app.get('/create', ensureAuthenticated, (req, res) => {
  res.render('create', { title: 'Créer un article' });
});

app.get('/articles', ensureAuthenticated, async (req, res) => {
  try {
    const articles = await Article.find({});
    res.render('articles', { title: 'Liste des articles', articles });
  } catch (err) {
    console.error('Erreur lors de la récupération des articles :', err);
    res.status(500).send('Erreur lors de la récupération des articles');
  }
});

app.get('/article/:codeArticle', ensureAuthenticated, async (req, res) => {
  const codeArticle = req.params.codeArticle;

  try {
    const article = await Article.findOne({ codeArticle });
    if (article) {
      res.render('article', { title: 'Article', article });
    } else {
      res.status(404).send('Article non trouvé');
    }
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'article :', err);
    res.status(500).send('Erreur lors de la récupération de l\'article');
  }
});

// API pour l'inscription
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    console.log('Utilisateur enregistré :', username);
    res.json({ success: true, message: 'Inscription réussie, vous pouvez maintenant vous connecter' });
  } catch (err) {
    console.error('Erreur lors de l\'insertion de l\'utilisateur :', err);
    res.status(500).send('Erreur lors de l\'inscription');
  }
});

// API pour la connexion
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = user;
      console.log('Utilisateur connecté :', username);
      res.json({ success: true, message: 'Connexion réussie' });
    } else {
      console.log('Échec de la connexion pour :', username);
      res.status(401).json({ success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }
  } catch (err) {
    console.error('Erreur lors de la recherche de l\'utilisateur :', err);
    res.status(500).send('Erreur lors de la connexion');
  }
});

// API pour créer un article
app.post('/create', ensureAuthenticated, async (req, res) => {
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

app.get('/api/articles', ensureAuthenticated, async (req, res) => {
  try {
    const articles = await Article.find({});
    res.json(articles);
  } catch (err) {
    console.error('Erreur lors de la récupération des articles :', err);
    res.status(500).send('Erreur lors de la récupération des articles');
  }
});

app.get('/api/article/:codeArticle', ensureAuthenticated, async (req, res) => {
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

// Route de déconnexion
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
