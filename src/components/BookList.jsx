import { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext.jsx";
import { bookService, authorService } from '../services';
import BookForm from './BookForm';
import Layout from './Layout';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const { validateToken } = useAuth();

    // Cargar libros
    const fetchBooks = async () => {
        setLoading(true);
        try {
            const data = await bookService.getAll();
            setBooks(data);
        } catch (err) {
            console.error('Error al cargar libros:', err);
            setError('No se pudieron cargar los libros');
        } finally {
            setLoading(false);
        }
    };

    // Cargar autores para el select de BookForm
    const fetchAuthors = async () => {
        try {
            const data = await authorService.getAll();
            setAuthors(data);
        } catch (err) {
            console.error('Error al cargar autores:', err);
        }
    };

    useEffect(() => {
        fetchAuthors();
        fetchBooks();
    }, []);

    const handleNew = () => {
        setSelectedBook(null);
        setShowForm(true);
    };

    const handleEdit = (book) => {
        setSelectedBook(book);
        setShowForm(true);
    };

    const handleSuccess = (savedBook, isEdit) => {
        if (isEdit) {
            setBooks(prev => prev.map(b => b.id === savedBook.id ? savedBook : b));
        } else {
            setBooks(prev => [...prev, savedBook]);
        }
        setShowForm(false);
    };

    const handleCancel = () => {
        setShowForm(false);
        setSelectedBook(null);
    };

    const handleDelete = async (bookId) => {
        if (!validateToken()) return;
        if (!confirm('¿Seguro que quieres eliminar este libro?')) return;

        try {
            await bookService.delete(bookId);
            setBooks(prev => prev.filter(b => b.id !== bookId));
        } catch (err) {
            console.error('Error al eliminar libro:', err);
            setError('No se pudo eliminar el libro');
        }
    };

    return (
        <Layout>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Libros</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleNew}
                    className="mb-4 px-4 py-2 bg-amber-50 text-black rounded hover:bg-amber-100"
                >
                    Nuevo Libro
                </button>

                {showForm && (
                    <BookForm
                        item={selectedBook}
                        authors={authors}
                        onSuccess={handleSuccess}
                        onCancel={handleCancel}
                    />
                )}

                <table className="w-full border border-gray-300 rounded-md">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">ID Libro</th>
                            <th className="p-2 border">Título</th>
                            <th className="p-2 border"> ID Autor</th>
                            <th className="p-2 border">Autor</th>
                            <th className="p-2 border">Año</th>
                            <th className="p-2 border">Género</th>
                            <th className="p-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book => {
                            const author = authors.find(a => a.id === book.author_id);
                            return (
                                <tr key={book.id} className="text-center border-t">
                                    <td className="p-2">{book.id}</td>
                                    <td className="p-2">{book.title}</td>
                                    <td className="p-2">{author?.id || '—'}</td>
                                    <td className="p-2">{author ? `${author.name} ${author.lastname}` : '—'}</td>
                                    <td className="p-2">{book.publication_year}</td>
                                    <td className="p-2">{book.genre}</td>
                                    <td className="p-2 space-x-2">
                                        <button
                                            onClick={() => handleEdit(book)}
                                            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(book.id)}
                                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {books.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-4 text-gray-500">No hay libros registrados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default BookList;
