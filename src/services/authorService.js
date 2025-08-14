import { API_BASE_URL, handleResponse } from './api.js';

export const authorService = {
    // Obtener todos los autores
    getAll: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/authors`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener autores:', error);
            throw error;
        }
    },

    // Obtener un autor por ID
    getById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/authors/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener autor:', error);
            throw error;
        }
    },

    // Crear un nuevo autor
    create: async (author) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/authors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: author.name,
                    lastname: author.lastname,
                })
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al crear autor:', error);
            throw error;
        }
    },

    // Actualizar un autor existente
    update: async (id, author) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/authors/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: author.name,
                    lastname: author.lastname,
                })
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al actualizar autor:', error);
            throw error;
        }
    },

    // Eliminar un autor
    delete: async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/authors/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al eliminar autor:', error);
            throw error;
        }
    }
};
