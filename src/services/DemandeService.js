import apiClient from './api';

const DemandeService = {

    // Récupérer toutes les demandes
    async getAllDemandes() {
        try {
            const response = await apiClient.get('/demandes');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des demandes:', error);
            throw error.response?.data || error;
        }
    },

    // Récupérer une demande par ID
    async getDemandeById(id) {
        try {
            const response = await apiClient.get(`/demandes/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de la demande ${id}:`, error);
            throw error.response?.data || error;
        }
    },

    // Créer une nouvelle demande
    async createDemande(demande) {
        try {
            const response = await apiClient.post('/demandes', demande);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la création de la demande:', error);
            throw error.response?.data || error;
        }
    },

    // Mettre à jour une demande
    async updateDemande(id, demande) {
        try {
            const response = await apiClient.put(`/demandes/${id}`, demande);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la mise à jour de la demande ${id}:`, error);
            throw error.response?.data || error;
        }
    },

    // Supprimer une demande
    async deleteDemande(id) {
        try {
            const response = await apiClient.delete(`/demandes/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la suppression de la demande ${id}:`, error);
            throw error.response?.data || error;
        }
    },

    // Valider une demande (changer l'état à 2)
    async validerDemande(id) {
        try {
            const response = await apiClient.put(`/demandes/${id}`, { etat: 2 });
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la validation de la demande ${id}:`, error);
            throw error.response?.data || error;
        }
    },

    // Refuser une demande (changer l'état à 3)
    async refuserDemande(id) {
        try {
            const response = await apiClient.put(`/demandes/${id}`, { etat: 3 });
            return response.data;
        } catch (error) {
            console.error(`Erreur lors du refus de la demande ${id}:`, error);
            throw error.response?.data || error;
        }
    },

    // Annuler une demande (changer l'état à 4)
    async annulerDemande(id) {
        try {
            const response = await apiClient.put(`/demandes/${id}`, { etat: 4 });
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de l'annulation de la demande ${id}:`, error);
            throw error.response?.data || error;
        }
    },

    // Récupérer les demandes par personnel
    async getDemandesByPersonnel(idPersonnel) {
        try {
            const response = await apiClient.get(`/demandes/personnel/${idPersonnel}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération des demandes du personnel ${idPersonnel}:`, error);
            throw error.response?.data || error;
        }
    },

    // Récupérer les demandes par état
    async getDemandesByEtat(etat) {
        try {
            const response = await apiClient.get(`/demandes/etat/${etat}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération des demandes avec l'état ${etat}:`, error);
            throw error.response?.data || error;
        }
    },

    // Récupérer les demandes par type de congé
    async getDemandesByTypeConge(idTypeConge) {
        try {
            const response = await apiClient.get(`/demandes/type-conge/${idTypeConge}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération des demandes du type de congé ${idTypeConge}:`, error);
            throw error.response?.data || error;
        }
    },

    // Récupérer les demandes pour le calendrier (avec relations)
    async getDemandesForCalendar() {
        try {
            const response = await apiClient.get('/demandes');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des demandes pour le calendrier:', error);
            throw error.response?.data || error;
        }
    },

    // Mettre à jour le statut d'une demande
    async updateStatut(id, etat) {
        try {
            const response = await apiClient.put(`/demandes/${id}/statut`, { etat });
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la mise à jour du statut:`, error);
            throw error.response?.data || error;
        }
    },

    // Mettre à jour les dates d'une demande
    async updateDates(id, dateDebut, dateFin) {
    try {
        // Convertir en Date
        const dDebut = new Date(dateDebut);
        const dFin = new Date(dateFin);

        // Ajouter 1 jour
        dDebut.setDate(dDebut.getDate() + 1);
        dFin.setDate(dFin.getDate() + 1);

        // Reformatage en YYYY-MM-DD
        const newDebut = dDebut.toISOString().split('T')[0];
        const newFin = dFin.toISOString().split('T')[0];

        const response = await apiClient.put(`/demandes/${id}/dates`, {
            debut: newDebut,
            fin: newFin
        });

        return response.data;

    } catch (error) {
        console.error(`Erreur lors de la mise à jour des dates:`, error);
        throw error.response?.data || error;
    }
}


};

export default DemandeService;