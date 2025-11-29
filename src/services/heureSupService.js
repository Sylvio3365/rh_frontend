import api  from './Zo_api';

export const heureSupService = {
  // Créer heures sup manuellement
  async creerHeureSupManuelle(heureSupData) {
    try {
      const response = await api.post('/heure-sup/manuel', heureSupData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Heures sup d'une période
  async getHeuresSupPeriode(idPersonnel, debut, fin) {
    try {
      const response = await api.get(`/heure-sup/periode/${idPersonnel}?debut=${debut}&fin=${fin}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Heures sup d'un mois
  async getHeuresSupMois(idPersonnel, mois, annee) {
    try {
      const response = await api.get(`/heure-sup/mois/${idPersonnel}?mois=${mois}&annee=${annee}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Supprimer heures sup
  async supprimerHeureSup(idHeureSup) {
    try {
      const response = await api.delete(`/heure-sup/${idHeureSup}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
