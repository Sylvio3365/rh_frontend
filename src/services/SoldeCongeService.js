import apiClient from './api';

const SoldeCongeService = {

    // Récupérer tous les soldes
    async getAllSoldes() {
        try {
            const response = await apiClient.get('/solde-conges');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des soldes:', error);
            throw error.response?.data || error;
        }
    },

    // Récupérer les soldes d'un personnel
    async getSoldesByPersonnel(idPersonnel) {
        try {
            const response = await apiClient.get(`/solde-conges/personnel/${idPersonnel}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération des soldes du personnel ${idPersonnel}:`, error);
            throw error.response?.data || error;
        }
    },

    // Récupérer le récapitulatif des soldes
    async getRecapitulatifSoldes(idPersonnel) {
        try {
            const response = await apiClient.get(`/solde-conges/personnel/${idPersonnel}/recapitulatif`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération du récapitulatif:`, error);
            throw error.response?.data || error;
        }
    },

    // Initialiser les soldes d'un personnel
    async initialiserSoldes(idPersonnel) {
        try {
            const response = await apiClient.post(`/solde-conges/personnel/${idPersonnel}/initialiser`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de l'initialisation des soldes:`, error);
            throw error.response?.data || error;
        }
    },

    // Utiliser des jours de congé
    async utiliserConge(idPersonnel, idTypeConge, jours) {
        try {
            const response = await apiClient.put(
                `/solde-conges/personnel/${idPersonnel}/type/${idTypeConge}/utiliser`,
                null,
                { params: { jours } }
            );
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de l'utilisation des congés:`, error);
            throw error.response?.data || error;
        }
    }

};

export default SoldeCongeService;