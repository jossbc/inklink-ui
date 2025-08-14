import { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext.jsx";
import { authorService } from '../services';
import AuthorForm from './AuthorForm';
import Layout from './Layout';

const AuthorList = () => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const { validateToken } = useAuth();

    const fetchAuthors = async () => {
        setLoading(true);
        try {
            const data = await authorService.getAll();
            setAuthors(data);
        } catch (err) {
            console.error('Error al cargar autores:', err);
            setError('No se pudieron cargar los autores');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuthors();
    }, []);

    const handleNew = () => {
        setSelectedAuthor(null);
        setShowForm(true);
    };

    const handleEdit = (author) => {
        setSelectedAuthor(author);
        setShowForm(true);
    };

    const handleSuccess = (savedAuthor, isEdit) => {
        if (isEdit) {
            setAuthors(prev => prev.map(a => a.id === savedAuthor.id ? savedAuthor : a));
        } else {
            setAuthors(prev => [...prev, savedAuthor]);
        }
        setShowForm(false);
    };

    const handleCancel = () => {
        setShowForm(false);
        setSelectedAuthor(null);
    };

const handleDelete = async (authorId) => {
    if (!validateToken()) return;
    if (!confirm('¿Seguro que quieres eliminar este autor?')) return;

    try {
        const cleanId = String(authorId).trim();
        if (!/^[a-fA-F0-9]{24}$/.test(cleanId)) {
            throw new Error('ID de autor inválido');
        }

        await authorService.delete(cleanId);
        setAuthors(prev => prev.filter(a => a.id !== authorId));
    } catch (err) {
        console.error('Error al eliminar autor:', err);
        setError(err?.message || 'No se pudo eliminar el autor');
    }
};

    return (
        <Layout>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Autores</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleNew}
                    className="mb-4 px-4 py-2 bg-amber-50 text-black rounded hover:bg-amber-100"
                >
                    Nuevo Autor
                </button>

                {showForm && (
                    <AuthorForm
                        item={selectedAuthor}
                        onSuccess={handleSuccess}
                        onCancel={handleCancel}
                    />
                )}

                <table className="w-full border border-gray-300 rounded-md">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Nombre</th>
                            <th className="p-2 border">Apellido</th>
                            <th className="p-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {authors.map(author => (
                            <tr key={author.id} className="text-center border-t">
                                <td className="p-2">{author?.id || '—'}</td>
                                <td className="p-2">{author.name}</td>
                                <td className="p-2">{author.lastname}</td>
                                <td className="p-2 space-x-2">
                                    <button
                                        onClick={() => handleEdit(author)}
                                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(author.id)}
                                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {authors.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-4 text-gray-500">No hay autores registrados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default AuthorList;