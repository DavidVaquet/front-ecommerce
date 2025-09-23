const API_URL = `${import.meta.env.VITE_API_URL}/users`;
import { apiFetch, auth } from "../helpers/auth";



export const register = async ({nombre, email, password, rol, activo, apellido, telefono, direccion}) => {
    
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({nombre, email, password, rol, activo, apellido, telefono, direccion})
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || 'Error en el registro');
        }

        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}

export const login = async ({email, password}) => {

    try {
        const data = await apiFetch(`${API_URL}/login`, {
          method: "POST",
          body: JSON.stringify({email, password})  
        });


        const token = data.token;
        if(token){
            auth.setToken(data.token);
        }
        const usuario = data.usuario;
        if (usuario){
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
        }

        return data;

    } catch (error) {
        
        throw new Error(error.message || 'Error al iniciar sesion.');
    }

}
export const editUserInfo = async ({nombre, apellido, telefono, direccion}) => {

    try {

        const data = await apiFetch(`${API_URL}/edit-user-info`, {
          method: "PUT",
          body: JSON.stringify({nombre, apellido, telefono, direccion})  
        });

        return data
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al editar el usuario.');
    }

}
export const updatePasswordUser = async ({password, nuevaPassword}) => {

    try {

        const data = await apiFetch(`${API_URL}/update-password`, {
          method: "PATCH",
          body: JSON.stringify({password, nuevaPassword})  
        });

        return data
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al actualizar la contraseña.');
    }

}

export const obtenerUsers= async({ filters = {} }) => {
    try {
        const url = new URL(`${API_URL}/obtener-usuarios`);
        const sp = url.searchParams;

        for (const [key, val] of Object.entries(filters)) {
            if (val == null || val === '') continue;
            if (Array.isArray(val)) {
                val.forEach(v => sp.append(key, String(v)));
            } else {
                sp.set(key, String(val));
            }
        }

        const res = apiFetch(url.toString());
        return res;
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al obtener los usuarios');
    }
}

export const getUserInfo = async () => {

    try {
        
        const data = await apiFetch(`${API_URL}/user-info`, {
            method: 'GET'
        })


        return data;
    } catch (error) {
        console.error(error);
    }
}
export const getSessions = async () => {

    try {
        
        const data = await apiFetch(`${API_URL}/user-sessions`);

        return data;
    } catch (error) {
        console.error(error);
    }
}

export const closeSession = async (id) => {

    try {

        const data = await apiFetch(`${API_URL}/close-session/${id}`, {
            method: 'DELETE'
        });

        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}
export const closeAllSessions = async () => {

    try {
        

        const data = await apiFetch(`${API_URL}/close-all-session`, {
            method: 'DELETE'
        });

        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}

export const recentActivity = async ({limite}) => {

    try {

        const url = new URL(`${API_URL}/recent-activity`);
        if (limite !== undefined) url.searchParams.set('limite', limite);

        const data = await apiFetch(`${url}`);

        return data;

    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}
export const statsUsage = async () => {

    try {

        const url = new URL(`${API_URL}/stats-usage`);

        const data = await apiFetch(`${url}`);
        return data;

    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}

export const editUser = async ({id, nombre, rol, apellido, activo}) => {

    try {
        
        const data = await apiFetch(`${API_URL}/edit-user/${id}`, {
            method: 'PUT',
            body: JSON.stringify({nombre, apellido, rol, activo})
        })

        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.msg);
    }
}

export const eliminarUser = async (id) => {

    try {    
        const data = await apiFetch(`${API_URL}/delete-user/${id}`, {
            method: 'DELETE'
        })

        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.msg);
    }
}

