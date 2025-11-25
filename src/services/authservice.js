import apiClient from './api';

const AuthService = {
    
    async hello() {
        const resp = await apiClient.get('/auth/hello');
        return resp.data;
    },

    async login(username, password) {
        try {
            const response = await apiClient.post('/auth/login', null, {
                params: {
                    username,
                    password
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async logout() {
        try {
            const response = await apiClient.get('/auth/logout');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async checkAuth() {
        try {
            const response = await apiClient.get('/auth/check');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default AuthService;