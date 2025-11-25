import apiClient from './api';

const PersonnelService = {

    async getAllPersonnel() {
        try {
            const response = await apiClient.get('/personnels');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async getGenderDistribution() {
        try {
            const response = await apiClient.get('/personnels/statistics/gender-distribution');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async getAgeDistribution() {
        try {
            const response = await apiClient.get('/personnels/statistics/age-distribution');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async getPersonnelCount() {
        try {
            const response = await apiClient.get('/personnels/statistics/count');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
    async getContractDistribution() {
        try {
            const response = await apiClient.get('/personnels/statistics/contract-distribution');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default PersonnelService;