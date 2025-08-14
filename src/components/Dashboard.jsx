import { useAuth } from "../context/AuthContext"
import Layout from "./Layout"

const Dashboard = () => {
    const { user } = useAuth()

    return (
        <Layout>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Selecciona una opción para comenzar
                </h2>
                <p className="text-gray-500">
                    Usa el menú de arriba para navegar entre los libros y autores.
                </p>
            </div>
        </Layout>
    )
}

export default Dashboard