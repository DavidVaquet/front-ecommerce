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
        localStorage.setItem('id', data.usuario.id);
        localStorage.setItem('rol', data.usuario.rol);
        localStorage.setItem('nombre', data.usuario.nombre);
        return data;

    } catch (error) {
        
        throw new Error(error.message || 'Error al iniciar sesion.');
    }

}


