import { apiURL } from './apiGlobal';

export const rsCatalog = async () => {
    const _apiURL = `${apiURL}/api/monitor`;

    try {
        const res = await fetch(_apiURL);
        const data = await res.json();

        return data; // Devolver los datos obtenidos
    } catch (error) {
        console.error('Error al obtener datos:', error);
        throw error; // Lanzar el error para manejarlo en el componente
    }
}
