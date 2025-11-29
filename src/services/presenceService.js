import  api  from './Zo_api';

export const presenceService = {
  // Présence d'une journée
  async getPresenceJour(idPersonnel, date) {
    try {
      const response = await api.get(`/presence/jour/${idPersonnel}?date=${date}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Présences d'une période
  async getPresencesPeriode(idPersonnel, debut, fin) {
    try {
      const response = await api.get(`/presence/periode/${idPersonnel}?debut=${debut}&fin=${fin}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Présences d'un mois
  async getPresencesMois(idPersonnel, mois, annee) {
    try {
      const response = await api.get(`/presence/mois/${idPersonnel}?mois=${mois}&annee=${annee}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};