import { apiFetch } from "../helpers/auth";
const API_URL = `${import.meta.env.VITE_API_URL}/clientes`;

export const toQueryBool = (v) => (v === undefined ? undefined : (v ? 'true' : 'false'));

export const crearClienteServices = async (formData) => {

        try {

            const data = await apiFetch(`${API_URL}/alta-cliente`, {
                method: 'POST',
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

            return data;
        } catch (error) {
            console.error(error);
            throw new Error(error.message || 'Error al crear el cliente back');
        }
     }

export const clientesEstado = async ({activo, limite, offset, search, origen}) => {

    try {

        const url = new URL(`${API_URL}/obtener-clientes`);
        const qActivo = toQueryBool(activo);
        if (qActivo !== undefined) url.searchParams.set('activo', qActivo); 
        if (limite > 0) url.searchParams.set('limite', limite);
        if (offset != null) url.searchParams.set('offset', offset);
        if (search != undefined) url.searchParams.set('search', search);
        if (origen != undefined) url.searchParams.set('origen', origen);


        const data = await apiFetch(`${url}`);

        return data;

    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}


export const clientesConCompras = async ({ activo,
  origen,
  search,
  limite,
  offset,
  tipo_cliente } = {}) => {
    try {
        const url = new URL(`${API_URL}/obtener-clientes-compras`);
        if (limite > 0) url.searchParams.set('limite', limite);
        if (origen != null) url.searchParams.set('origen', origen);
        if (search != null) url.searchParams.set('search', search);
        if (offset != null) url.searchParams.set('offset', offset);
        if (activo != null) url.searchParams.set('activo', activo);
        if (tipo_cliente != null) url.searchParams.set('tipo_cliente', tipo_cliente);

        const data = await apiFetch(`${url}`);

        return data;

    } catch (error) {
        console.error(error);
        throw error;
    }
}
export const bajaCliente = async ({ id, email, estado }) => {
    
    try {

        const data = await apiFetch(`${API_URL}/suspender-cliente/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ email, estado }),
        });

        return data;

    } catch (error) {
        console.error("Error en bajaCliente:", error);
        throw error;
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

        const data = await apiFetch(`${API_URL}/editar-cliente/${id}`, {
        method: "PUT",
        body: JSON.stringify({ nombre, apellido, telefono, tipo_cliente, direccion, ciudad, pais, codigo_postal, notas, es_vip, provincia }),
        });
        
        return data;
    } catch (error) {
        console.error("Error en editarClienteService:", error);
        throw error;
    }
};

export const clientesEstadisticas = async({ scope }) => {

    try {
        const url = new URL(`${API_URL}/obtener-estadisticas-clientes`);
        if (scope != null) url.searchParams.set('scope', scope);

        const res = await apiFetch(url);

        return res;
    } catch (error) {
        console.error(error);
        throw error;
    }
}