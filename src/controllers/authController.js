import { login } from "../services/authServices";

const ROLES_ADMIN = ['admin', 'supervisor', 'vendedor'];

export const loginController = async ({email, password, toast, setUser, navigate}) => {

    try {
        const data = await login({email, password});
        setUser(data.usuario);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        localStorage.setItem('token', data.token);
        const rol = (data.usuario.rol || "").toLowerCase().trim();
        

        if (ROLES_ADMIN.includes(rol)) {
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