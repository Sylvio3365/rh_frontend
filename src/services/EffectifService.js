import apiClient from './api';

const EffectifService = {
    async getEffectifByMoisRange(moisDebut, moisFin, annee) {
        try {
            const response = await apiClient.get('/effectif/mois-range', {
                params: {
                    moisDebut: moisDebut,
                    moisFin: moisFin,
                    annee: annee
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

export default EffectifService;