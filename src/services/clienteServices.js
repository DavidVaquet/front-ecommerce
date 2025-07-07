const API_URL = `${import.meta.env.VITE_API_URL}/clientes`;

export const crearClienteServices = async (formData) => {

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Vuelve a iniciar sesión.');

            const response = await fetch(`${API_URL}/alta-cliente`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
                body: JSON.stringify(
                    {nombre: formData.nombre,
                     apellido: formData.apellido,
                     email: formData.email,
                     telefono: formData.telefono,
                     fecha_nacimiento: formData.fecha_nacimiento,
                     tipo_cliente: formData.tipo_cliente,
                     es_vip: formData.es_vip,
                     direccion: formData.direccion,
                     ciudad: formData.ciudad,
                     pais: formData.pais,
                     codigo_postal: formData.codigo_postal,
                     notas: formData.notas})
            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Error al crear el cliente.')
            }
            return data;
        } catch (error) {
            console.error(error);
            throw new Error(error.message || 'Error al crear el cliente back');
        }
     }

export const clientesActivoServices = async () => {

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Vuelve a iniciar sesión, el token es obligatorio.')
        
        const response = await fetch(`${API_URL}/obtener-clientes-activos`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || 'Error al obtener los clientes activos.')
        };

        return data;

    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}