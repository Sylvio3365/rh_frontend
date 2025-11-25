// Utilitaires pour gérer l'authentification
export const authUtils = {
    // Vérifier si l'utilisateur est connecté
    isAuthenticated() {
        return localStorage.getItem('isAuthenticated') === 'true';
    },

    // Obtenir l'utilisateur connecté
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Déconnecter l'utilisateur
    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
    },

    // Connecter l'utilisateur
    login(userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
    }
};