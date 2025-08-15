import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookService, authorService } from '../services';

const VALID_GENRES = [
    "Fantasia", "Ciencia Ficcion", "Romance", "Drama", "Terror",
    "Misterio", "Historico", "Poesia", "Juvenil"
];

const BookForm = ({ item, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        title: item?.title || '',
        genre: item?.genre || '',
        author_id: item?.author_id || '',
        publication_year: item?.publication_year || '',
        active: item?.active ?? true
    });
    const [authors, setAuthors] = useState([]);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { validateToken } = useAuth();

    useEffect(() => {
        const loadAuthors = async () => {
            try {
                const res = await authorService.getAll();
                setAuthors(res || []);
            } catch (err) {
                console.error("Error cargando autores", err);
            }
        };
        loadAuthors();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) setError('');
    };

    const handleSubmit = async () => {

        if (isSubmitting) return;
        if (!validateToken()) return;

        // Validaciones
        if (!formData.title.trim()) {
            setError('El título es requerido');
            return;
        }
        if (!formData.genre) {
            setError('El género es requerido');
            return;
        }
        if (!VALID_GENRES.includes(formData.genre)) {
            setError(`Género no válido. Usa uno de: ${VALID_GENRES.join(', ')}`);
            return;
        }
        if (!formData.author_id) {
            setError('Debes seleccionar un autor');
            return;
        }
        if (!formData.publication_year) {
            setError('El año de publicación es requerido');
            return;
        }
        const yearNum = Number(formData.publication_year);
        if (isNaN(yearNum) || yearNum < 1400 || yearNum > 2025) {
            setError('El año de publicación debe estar entre 1400 y 2025');
            return;
        }

        setIsSubmitting(true);
        try {
            setError('');
            let savedItem;
            if (item) {
                savedItem = await bookService.update(item.id, formData);
                if (!savedItem) savedItem = { ...item, ...formData };
                onSuccess(savedItem, true);
            } else {
                savedItem = await bookService.create(formData);
                if (!savedItem) savedItem = { id: Date.now(), ...formData };
                onSuccess(savedItem, false);
            }
        } catch (err) {
            console.error('Error al guardar:', err);
            setError(err.message || 'Error al guardar el libro');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isSubmitting) handleSubmit();
        if (e.key === 'Escape') onCancel();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        {item ? 'Editar Libro' : 'Nuevo Libro'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                            <span>❌ {error}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Título */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Título *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                maxLength="200"
                            />
                        </div>

                        {/* Género */}
                        <div>
                            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                                Género *
                            </label>
                            <select
                                id="genre"
                                name="genre"
                                value={formData.genre}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                            >
                                <option value="">Seleccione un género</option>
                                {VALID_GENRES.map(g => (
                                    <option key={g} value={g}>
                                        {g}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Autor */}
                        <div>
                            <label htmlFor="author_id" className="block text-sm font-medium text-gray-700 mb-1">
                                Autor *
                            </label>
                            <select
                                id="author_id"
                                name="author_id"
                                value={formData.author_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                            >
                                <option value="">Seleccione un autor</option>
                                {authors.map(a => (
                                    <option key={a.id} value={a.id}>
                                        {a.name} {a.lastname}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Año */}
                        <div>
                            <label htmlFor="publication_year" className="block text-sm font-medium text-gray-700 mb-1">
                                Año de publicación *
                            </label>
                            <input
                                type="number"
                                id="publication_year"
                                name="publication_year"
                                value={formData.publication_year}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                placeholder="Ej: 2023"
                            />
                        </div>

                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 rounded-md disabled:opacity-50"
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookForm;

