const API_URL = `${import.meta.env.VITE_API_URL}/clientes`;

export const toQueryBool = (v) => (v === undefined ? undefined : (v ? 'true' : 'false'));

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

export const clientesEstado = async ({activo}) => {

    try {

        const url = new URL(`${API_URL}/obtener-clientes`);
        const qActivo = toQueryBool(activo);
        if (qActivo !== undefined) url.searchParams.set('activo', qActivo); 

        const token = localStorage.getItem('token');
        if (!token) throw new Error('Vuelve a iniciar sesión, el token es obligatorio.')
        
        const response = await fetch(`${url}`, {
            method: 'GET',
            headers: {'Accept': 'application/json', 'Authorization': `Bearer ${token}`}
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


export const clientesConCompras = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('El token es necesario, vuelve a iniciar sesión.');

        const response = await fetch(`${API_URL}/obtener-clientes-compras`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`}
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || 'Error al obtener los clientes con compras realizadas.')
        };

        return data;
    } catch (error) {
        console.error(error);
    }
}
export const bajaCliente = async ({ id, email, estado }) => {
    
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("El token es necesario, vuelve a iniciar sesión.");

        const response = await fetch(`${API_URL}/suspender-cliente/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, estado }),
        });

        const data = await response.json();

        if (!response.ok) {
        throw new Error(data.msg || "Error al cambiar el estado del cliente.");
        }

        return data;
    } catch (error) {
        console.error("Error en bajaCliente:", error);
    }
};
export const editarClienteService = async ({
    nombre,
    apellido, 
    telefono, 
    tipo_cliente, 
    direccion, 
    ciudad, 
    pais, 
    codigo_postal, 
    notas,
    es_vip,
    provincia,
    id}) => {
    
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("El token es necesario, vuelve a iniciar sesión.");

        const response = await fetch(`${API_URL}/editar-cliente/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, apellido, telefono, tipo_cliente, direccion, ciudad, pais, codigo_postal, notas, es_vip, provincia }),
        });

        const data = await response.json();

        if (!response.ok) {
        throw new Error(data.msg || "Error al modificar el cliente.");
        }

        return data;
    } catch (error) {
        console.error("Error en editarClienteService:", error);
    }
};