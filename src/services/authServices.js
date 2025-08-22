const API_URL = `${import.meta.env.VITE_API_URL}/users`;



export const register = async ({nombre, email, password, rol, activo}) => {
    
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({nombre, email, password, rol, activo})
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
        const response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({email, password})  
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.msg || 'Error al iniciar sesion.')
        };

        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        return data;

    } catch (error) {
        
        throw new Error(error.message || 'Error al iniciar sesion.');
    }

}
export const editUserInfo = async ({nombre, apellido, telefono, direccion}) => {

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token no proporcionado');

        const response = await fetch(`${API_URL}/edit-user-info`, {
          method: "PUT",
          headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
          body: JSON.stringify({nombre, apellido, telefono, direccion})  
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || 'Error al editar el usuario.')
        };

        return data
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al editar el usuario.');
    }

}
export const updatePasswordUser = async ({password, nuevaPassword}) => {

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token no proporcionado');

        const response = await fetch(`${API_URL}/update-password`, {
          method: "PATCH",
          headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
          body: JSON.stringify({password, nuevaPassword})  
        });

        const data = await response.json();
        if (!response.ok) {
            const msg = data?.msg;
            throw new Error(msg || 'Error al actualizar la contraseña.')
        };

        return data
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error al actualizar la contraseña.');
    }

}

export const getUserInfo = async () => {

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token no proporcionado');
        const res = await fetch(`${API_URL}/user-info`, {
            method: 'GET',
            headers: {'Accept': 'application/json', Authorization: `Bearer ${token}`}
        })

        const data = await res.json();

        if (!res.ok) throw new Error(data.msg || 'Error al obtener la información de los usuarios');

        return data;
    } catch (error) {
        console.error(error);
    }
}
export const getSessions = async () => {

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token no proporcionado');
        const res = await fetch(`${API_URL}/user-sessions`, {
            method: 'GET',
            headers: {'Accept': 'application/json', Authorization: `Bearer ${token}`}
        })

        const data = await res.json();

        if (!res.ok) throw new Error(data.msg || 'Error al obtener la información de los usuarios');

        return data;
    } catch (error) {
        console.error(error);
    }
}

export const closeSession = async (id) => {

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token no proporcionado');

        const res = await fetch(`${API_URL}/close-session/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        if (!res.ok) {
            const msg = data?.msg;
            throw new Error(msg || 'Error en el cierre de sesión.');
        };

        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}
export const closeAllSessions = async () => {

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token no proporcionado');

        const res = await fetch(`${API_URL}/close-all-session`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
        });

        const data = await res.json();

        if (!res.ok) {
            const msg = data?.msg;
            throw new Error(msg || 'Error en el cierre de sesión.');
        };

        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}

export const recentActivity = async ({limite}) => {

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Falta el token.');

        const url = new URL(`${API_URL}/recent-activity`);
        if (limite !== undefined) url.searchParams.set('limite', limite);

        const res = await fetch(`${url}`, {
            headers: {'Accept': 'application/json', Authorization: `Bearer ${token}`}
        });

        const data = await res.json();

        if (!res.ok) {
            const msg = data.msg;
            throw new Error(msg || 'Error al obtener la actividad reciente.');
        };

        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}
export const statsUsage = async () => {

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Falta el token.');

        const url = new URL(`${API_URL}/stats-usage`);

        const res = await fetch(`${url}`, {
            headers: {'Accept': 'application/json', Authorization: `Bearer ${token}`}
        });

        const data = await res.json();

        if (!res.ok) {
            const msg = data.msg;
            throw new Error(msg || 'Error al obtener las estadisticas de uso.');
        };

        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}


