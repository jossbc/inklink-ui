// src/services/bookService.js
import { API_BASE_URL, handleResponse } from './api.js';

export const bookService = {
    // Obtener todos los libros
    getAll: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/books`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener los libros:', error);
            throw error;
        }
    },

    // Obtener un libro por ID
    getById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/books/${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al obtener el libro:', error);
            throw error;
        }
    },

    // Crear un nuevo libro
    create: async (book) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/books`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: book.title,
                    author_id: book.author_id,
                    publication_year: book.publication_year,
                    genre: book.genre
                })
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al crear el libro:', error);
            throw error;
        }
    },

    // Actualizar un libro existente
    update: async (id, book) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/books/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: book.title,
                    author_id: book.author_id,
                    publication_year: book.publication_year,
                    genre: book.genre
                })
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al actualizar el libro:', error);
            throw error;
        }
    },

    // Eliminar un libro
    delete: async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/books/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error al eliminar el libro:', error);
            throw error;
        }
    }
};
