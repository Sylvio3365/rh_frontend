import apiClient from './api';

const TypeCongeService = {

    // Récupérer tous les types de congés
    async getAllTypeConge() {
        try {
            const response = await apiClient.get('/type-conges');
            return response.data;
        } catch (error) {
            console.error('Erreur lors du chargement des types de congés :', error);
            throw error.response?.data || error;
        }
    }

};

export default TypeCongeService;
