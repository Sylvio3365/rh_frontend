import apiClient from './api';

const DemandeService = {

    // Récupérer toutes les demandes
    async getAllDemandes() {
        try {
            const response = await apiClient.get('/demandes');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

};

export default DemandeService;
