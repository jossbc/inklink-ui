export const API_BASE_URL = 'https://inklink-production.up.railway.app';

export const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    switch (response.status) {
      case 400:
        throw new Error(errorData.message || 'Error en los datos enviados.');
      case 401:
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Tu sesión ha expirado.');
      case 403:
        throw new Error('No tienes permisos para realizar esta acción.');
      case 404:
        throw new Error('Recurso no encontrado.');
      case 409:
        throw new Error('El usuario ya existe.');
      case 500:
        throw new Error('Error interno del servidor.');
      default:
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
  }
  return response.json();
};