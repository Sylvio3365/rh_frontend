import api from './Zo_api';
import * as response from "autoprefixer";

export const pointageService = {
  // Enregistrer un pointage
  async enregistrerPointage(pointageData) {
    try {
      const response = await api.post('/pointage/enregistrer', pointageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Récupérer les horaires actifs
  async getHorairesActifs() {
    try {
      const response = await api.get('/pointage/horaires');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Récupérer les pointages d'une journée
  async getPointagesJour(idPersonnel, date = null) {
    const dateParam = date ? `?date=${date}` : '';
    try {
      const response = await api.get(`/pointage/jour/${idPersonnel}${dateParam}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Récupérer tous les pointages d'un personnel
  async getPointagesPersonnel(idPersonnel) {
    try {
      const response = await api.get(`/pointage/personnel/${idPersonnel}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Suggérer le prochain type de pointage
  async suggererProchainType(idPersonnel) {
    try {
      const response = await api.get(`/pointage/prochain-type/${idPersonnel}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Consolider une journée
  async consoliderJournee(idPersonnel, date) {
    try {
      const response = await api.post(`/pointage/consolider/${idPersonnel}?date=${date}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};