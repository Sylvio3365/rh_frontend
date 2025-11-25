import apiClient from './api';

const AuthService = {
    async hello() {
        const resp = await apiClient.get('/auth/hello');
        return resp.data;
    }
};

export default AuthService;