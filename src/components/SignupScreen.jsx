import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isValidEmail, validatePassword, getPasswordStrength } from "../utils/validators";

const SignupScreen = () => {
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSignup = async () => {
        if (isSubmitting) return;

        setError('');
        setSuccess('');
        setIsSubmitting(true);

        if (!formData.name.trim()) {
            setError('El nombre es requerido');
            setIsSubmitting(false);
            return;
        }
        if (!formData.lastname.trim()) {
            setError('El apellido es requerido');
            setIsSubmitting(false);
            return;
        }
        if (!formData.email.trim()) {
            setError('El email es requerido');
            setIsSubmitting(false);
            return;
        }
        if (!isValidEmail(formData.email)) {
            setError('Por favor ingresa un email válido');
            setIsSubmitting(false);
            return;
        }

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            setError(passwordValidation.message);
            setIsSubmitting(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setIsSubmitting(false);
            return;
        }

        try {
            const result = await register(formData.name, formData.lastname, formData.email, formData.password);
            if (result) {
                setSuccess('¡Cuenta creada exitosamente! Redirigiendo al login...');
                setFormData({ name: '', lastname: '', email: '', password: '', confirmPassword: '' });
                navigate('/login', { replace: true });
            }
        } catch (error) {
            console.error('Error en registro:', error);
            setError(error.message || 'Error al crear la cuenta. Intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black_bean-100 flex items-center justify-center p-4">
            <div className="bg-black_bean-500 p-8 rounded-2xl shadow-lg w-full max-w-md border border-auburn-600">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-auburn-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                        <span className="text-2xl text-black">📖</span>
                    </div>
                     <h1 className="text-3xl font-serif font-bold text-rosewood-100 tracking-wide"> InkLink </h1>               
                          <p className="text-rosewood-300 italic">Crea tu cuenta y empieza tu viaje literario 🥸 </p>
                </div>

                {/* Mensajes de error y éxito */}
                {error && (
                    <div className={`mb-4 p-3 rounded-md border text-sm ${
                        error.includes('email ya está registrado') || error.includes('usuario ya existe')
                            ? 'bg-rosewood-800 border-rosewood-600 text-rosewood-100'
                            : 'bg-falu_red-800 border-falu_red-600 text-falu_red-100'
                    }`}>
                        <div className="flex items-center">
                            <span className="mr-2">
                                {error.includes('email ya está registrado') || error.includes('usuario ya existe') ? '⚠️' : '❌'}
                            </span>
                            <span>{error}</span>
                        </div>
                        {(error.includes('email ya está registrado') || error.includes('usuario ya existe')) && (
                            <div className="mt-2">
                                <Link to="/login" className="text-auburn-300 hover:underline">
                                    ¿Ya tienes cuenta? Inicia sesión aquí
                                </Link>
                            </div>
                        )}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 bg-green-800 border border-green-600 text-green-100 rounded-md text-sm">
                        <div className="flex items-center">
                            <span className="mr-2">✅</span>
                            <span>{success}</span>
                        </div>
                    </div>
                )}

                {/* Formulario */}
                <form className="space-y-4" noValidate>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-auburn-200 mb-1">
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-auburn-600 rounded-md bg-black_bean-400 text-black placeholder-auburn-800 focus:outline-none focus:ring-2 focus:ring-auburn-500"
                                placeholder="Juan"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastname" className="block text-sm font-medium text-auburn-200 mb-1">
                                Apellido
                            </label>
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-auburn-600 rounded-md bg-black_bean-400 text-black placeholder-auburn-800 focus:outline-none focus:ring-2 focus:ring-auburn-500"
                                placeholder="Pérez"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-auburn-200 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-auburn-600 rounded-md bg-black_bean-400 text-black placeholder-auburn-800 focus:outline-none focus:ring-2 focus:ring-auburn-500"
                            placeholder="usuario2@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-auburn-200 mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-auburn-600 rounded-md bg-black_bean-400 text-black placeholder-auburn-800 focus:outline-none focus:ring-2 focus:ring-auburn-500"
                            placeholder="8-64 caracteres, 1 mayúscula, 1 número, 1 especial"
                        />

                        {formData.password && (
                            <div className="mt-2">
                                <div className="text-xs text-auburn-300 mb-1">Requisitos de contraseña:</div>
                                <div className="space-y-1">
                                    {(() => {
                                        const strength = getPasswordStrength(formData.password);
                                        return (
                                            <>
                                                <div className={`text-xs flex items-center ${strength.isValidLength ? 'text-green-400' : 'text-auburn-800'}`}>
                                                    <span className="mr-1">{strength.isValidLength ? '✓' : '○'}</span>
                                                    8-64 caracteres
                                                </div>
                                                <div className={`text-xs flex items-center ${strength.hasUppercase ? 'text-green-400' : 'text-auburn-800'}`}>
                                                    <span className="mr-1">{strength.hasUppercase ? '✓' : '○'}</span>
                                                    Al menos una mayúscula
                                                </div>
                                                <div className={`text-xs flex items-center ${strength.hasNumber ? 'text-green-400' : 'text-auburn-800'}`}>
                                                    <span className="mr-1">{strength.hasNumber ? '✓' : '○'}</span>
                                                    Al menos un número
                                                </div>
                                                <div className={`text-xs flex items-center ${strength.hasSpecialChar ? 'text-green-400' : 'text-auburn-800'}`}>
                                                    <span className="mr-1">{strength.hasSpecialChar ? '✓' : '○'}</span>
                                                    Carácter especial (@$!%*?&)
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-auburn-200 mb-1">
                            Confirmar Contraseña
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-auburn-600 rounded-md bg-black_bean-400 text-black placeholder-auburn-800 focus:outline-none focus:ring-2 focus:ring-auburn-500"
                            placeholder="Confirma tu contraseña"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSignup();
                            }}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleSignup}
                        disabled={isSubmitting}
                        className="w-full bg-auburn-600 text-black py-2 px-4 rounded-md hover:bg-auburn-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </button>
                </form>

                {/* Link de login */}
                <p className="text-center text-sm text-auburn-300 mt-4">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="text-auburn-400 hover:text-auburn-300 underline">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupScreen;
