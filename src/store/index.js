import { createStore } from 'vuex';
import AuthService from '@/services/auth';

export default createStore({
    state: {
        user: null,
        isAuthenticated: false,
        loading: false
    },
    mutations: {
        SET_USER(state, user) {
            state.user = user;
            state.isAuthenticated = !!user;
        },
        SET_LOADING(state, loading) {
            state.loading = loading;
        },
        CLEAR_USER(state) {
            state.user = null;
            state.isAuthenticated = false;
        }
    },
    actions: {
        async login({ commit }, credentials) {
            commit('SET_LOADING', true);
            try {
                const response = await AuthService.login(credentials.username, credentials.password);
                if (response.success) {
                    commit('SET_USER', response.user);
                    return { success: true, data: response };
                } else {
                    return { success: false, error: response.message };
                }
            } catch (error) {
                return { success: false, error: error.message || 'Erreur de connexion' };
            } finally {
                commit('SET_LOADING', false);
            }
        },

        async logout({ commit }) {
            try {
                await AuthService.logout();
                commit('CLEAR_USER');
                return { success: true };
            } catch (error) {
                commit('CLEAR_USER'); // Se déconnecter localement même en cas d'erreur
                return { success: false, error: error.message };
            }
        },

        async checkAuth({ commit }) {
            try {
                const response = await AuthService.checkAuth();
                if (response.success) {
                    commit('SET_USER', response.user);
                } else {
                    commit('CLEAR_USER');
                }
                return response;
            } catch (error) {
                commit('CLEAR_USER');
                throw error;
            }
        }
    },
    getters: {
        currentUser: state => state.user,
        isAuthenticated: state => state.isAuthenticated,
        isLoading: state => state.loading
    }
});