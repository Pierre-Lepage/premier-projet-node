# Projet Node.js

## Description

Ce projet est une application web développée avec Node.js et Express, permettant la gestion d'articles et d'utilisateurs. Il inclut des fonctionnalités de CRUD (Create, Read, Update, Delete) pour les articles, une gestion des utilisateurs avec inscription et connexion, et une interface utilisateur dynamique utilisant EJS.

## Structure du Projet

.
├── config.js
├── data
│ └── articles.json
├── logger.js
├── logs
│ ├── log.json
│ └── users.json
├── models
│ ├── User.js
│ └── Article.js
├── package-lock.json
├── package.json
├── public
│ ├── script.js
│ └── style.css
├── routes
│ └── users.js
├── server.js
├── users.json
└── views
├── article.ejs
├── articles.ejs
├── create.ejs
├── index.ejs
├── login.ejs
├── partials
│ ├── footer.ejs
│ └── header.ejs
└── register.ejs

perl
Copier le code

## Configuration

Le fichier `config.js` contient les configurations de l'application, y compris la connexion à la base de données MongoDB via l'URI `mongodb://localhost:27017/BDD1_projet_node`.

## Installation

1. Clonez le dépôt :
   ```sh
   git clone <URL_DU_DEPOT>
Installez les dépendances :
sh
Copier le code
npm install
Configurez la base de données MongoDB dans config.js.
Lancez le serveur :
sh
Copier le code
npm start
Fonctionnalités
Gestion des Articles
CRUD : Création, lecture, mise à jour et suppression des articles.
Filtrage par Catégorie : Les articles peuvent être filtrés par catégorie.
Recherche : Recherche d'articles par nom ou description.
Gestion des Utilisateurs
Inscription : Les utilisateurs peuvent s'inscrire avec un nom d'utilisateur, un email et un mot de passe.
Connexion : Les utilisateurs peuvent se connecter et accéder à des fonctionnalités restreintes.
Sécurité : Utilisation de bcrypt pour le hachage des mots de passe et de JWT pour les tokens.
Vues
index.ejs : Page d'accueil.
login.ejs : Page de connexion.
register.ejs : Page d'inscription.
create.ejs : Page de création d'article.
articles.ejs : Liste des articles.
article.ejs : Détail d'un article spécifique.
partials/header.ejs et partials/footer.ejs : En-tête et pied de page communs.
Journalisation
Le fichier logger.js utilise winston pour la gestion des logs, enregistrés dans le dossier logs sous forme de fichiers JSON.

Contribution
Fork le projet.
Créez une branche pour votre fonctionnalité (git checkout -b feature/NouvelleFonctionnalité).
Commitez vos modifications (git commit -am 'Ajout d'une nouvelle fonctionnalité').
Poussez la branche (git push origin feature/NouvelleFonctionnalité).
Ouvrez une Pull Request.
Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

Contact
Pour toute question ou suggestion, veuillez contacter votre.email@example.com.

