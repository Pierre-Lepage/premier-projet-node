// Simuler l'état de connexion de l'utilisateur
let userLoggedIn = false; // Par défaut, l'utilisateur n'est pas connecté

// Sélectionner les éléments du DOM
const registerLink = document.getElementById('register-link');
const loginLink = document.getElementById('login-link');

// Fonction pour mettre à jour l'affichage des liens d'inscription et de connexion
function updateAuthLinks() {
    if (userLoggedIn) {
        // Si l'utilisateur est connecté, afficher "Connexion"
        registerLink.innerHTML = '<i class="fas fa-sign-in-alt"></i> Connexion';
        registerLink.href = '/login'; // Lien vers la page de connexion
    } else {
        // Sinon, afficher "Inscription"
        registerLink.innerHTML = '<i class="fas fa-user-plus"></i> Inscription';
        registerLink.href = '/register'; // Lien vers la page d'inscription
    }
}

// Appeler la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    updateAuthLinks();
});
