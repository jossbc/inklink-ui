import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authorService } from '../services';

const AuthorForm = ({ item, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        name: item?.name || '',
        lastname: item?.lastname || '',
        bio: item?.bio || '',
        active: item?.active ?? true
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { validateToken } = useAuth();

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

    if (!formData.name.trim()) {
        setError('El nombre es requerido');
        return;
    }
    if (!formData.lastname.trim()) {
        setError('El apellido es requerido');
        return;
    }

    setIsSubmitting(true);

    try {
        setError('');
        let savedItem;

        if (item) {
            savedItem = await authorService.update(item.id, formData);
            if (!savedItem) savedItem = { ...item, ...formData };
            onSuccess(savedItem, true);
        } else {
            savedItem = await authorService.create(formData);
            if (!savedItem) savedItem = { id: Date.now().toString(), ...formData };
            onSuccess(savedItem, false);
        }
    } catch (err) {
        console.error('Error al guardar:', err);
        setError(err.message || 'Error al guardar el autor');
    } finally {
        setIsSubmitting(false);
    }
};

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isSubmitting) handleSubmit();
        if (e.key === 'Escape') onCancel();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-50 rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        {item ? 'Editar Autor' : 'Nuevo Autor'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md">
                            <span>❌ {error}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                                placeholder="Nombre del autor"
                                maxLength="50"
                                autoFocus={!item}
                            />
                        </div>

                        <div>
                            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
                                Apellido *
                            </label>
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                                placeholder="Apellido del autor"
                                maxLength="50"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-gray-700 hover:bg-gray-800 rounded-md disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthorForm;
