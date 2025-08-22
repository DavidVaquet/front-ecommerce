import { login } from "../services/authServices";


export const loginController = async ({email, password, toast, setUser, navigate}) => {

    try {
        const data = await login({email, password});
        setUser(data.usuario);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        localStorage.setItem('token', data.token);

        if (data.usuario.rol === 'admin') {
            navigate("/admin/productos")
        } else if (data.usuario.rol === 'cliente') {
            navigate("/perfil")
        } else {
            navigate("/login")
        }
        
    } catch (error) {
        toast.error( error.message || 'Error al iniciar sesion.');
    }
};