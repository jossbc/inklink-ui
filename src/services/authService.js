import { API_BASE_URL, handleResponse } from './api.js';

export const authService = {
    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return handleResponse(response);
    },

    register: async (name, lastname, email, password) => {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, lastname, email, password }),
        });
        return handleResponse(response);
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    },

    isAuthenticated: () => !!localStorage.getItem('authToken'),
    getCurrentUser: () => {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }
};
