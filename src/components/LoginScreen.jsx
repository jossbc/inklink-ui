import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext";

const LoginScreen = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth(); // Removemos loading del contexto
    const navigate = useNavigate();

    const handleLogin = async () => {
        // Evitar múltiples envíos
        if (isSubmitting) {
            return;
        }

        setError("");
        setIsSubmitting(true);

        // Validaciones básicas (solo formato, no complejidad)
        if (!email.trim()) {
            setError('El email es requerido');
            setIsSubmitting(false);
            return;
        }

        // Validación básica de formato de email (no tan estricta)
        if (!email.includes('@') || !email.includes('.')) {
            setError('Por favor ingresa un email válido');
            setIsSubmitting(false);
            return;
        }

        if (!password.trim()) {
            setError('La contraseña es requerida');
            setIsSubmitting(false);
            return;
        }
        
        // Sin validaciones complejas de contraseña para login
        // El servidor validará las credenciales

        try {
            console.log("Intentando login con:", { email, password: "***" });
            const result = await login(email, password);
            console.log("Resultado del login:", result);
            if (result) {
                navigate("/dashboard", { replace: true });
            }
        } catch (error) {
            console.error("Error en login:", error);
            setError(error.message || 'Error al iniciar sesión. Intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };


  return (
  <div
    className="min-h-screen flex items-center justify-center p-4"
    style={{
      backgroundImage: "url('https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXJ2YW1vbHZuY25zMnRxMmxxamFuMWZnb3cwcHZ0dWw5ODd4amlvMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dMsAGXbyJjnSis9Q9r/giphy.gif')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    <div className="bg-black_bean-500 p-8 rounded-xl shadow-xl w-full max-w-md border border-black_bean-400">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-rosewood-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
          <span className="text-3xl text-rosewood-100">📖</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-rosewood-100 tracking-wide">
          InkLink
        </h1>
        <p className="text-rosewood-300 italic">Tu rincón literario 🥸 </p>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="mb-4 p-3 bg-falu_red-100 border border-falu_red-300 text-falu_red-700 rounded-md text-sm shadow-sm">
          <div className="flex items-center">
            <span className="mr-2">❌</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Formulario */}
      <form className="space-y-5" noValidate>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-rosewood-100 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            required
            className="w-full px-4 py-2 border border-rosewood-300 rounded-md bg-black_bean-100 text-rosewood-100 focus:outline-none focus:ring-2 focus:ring-rosewood-500 focus:border-rosewood-500 transition"
            placeholder="tucorreo@ejemplo.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-rosewood-100 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            required
            className="w-full px-4 py-2 border border-rosewood-300 rounded-md bg-black_bean-100 text-rosewood-100 focus:outline-none focus:ring-2 focus:ring-rosewood-500 focus:border-rosewood-500 transition"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
          />
        </div>

        <button
          type="button"
          onClick={handleLogin}
          className="w-full bg-rosewood-500 text-rosewood-100 py-2 px-4 rounded-md hover:bg-rosewood-600 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>

      {/* Link de registro */}
      <p className="text-center text-sm text-rosewood-300 mt-6">
        ¿No tienes cuenta?{" "}
        <Link
          to="/signup"
          className="text-rosewood-500 hover:text-rosewood-700 underline decoration-rosewood-400"
        >
          Regístrate
        </Link>
      </p>
    </div>
  </div>
);
