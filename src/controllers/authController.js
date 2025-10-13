import { login } from "../services/authServices";

const ROLES_ADMIN = ['admin', 'supervisor', 'vendedor'];

export const loginController = async ({email, password, toast, setUser, navigate, setToken}) => {

    try {
        const data = await login({email, password});
        const token = data?.token;
        setUser(data?.usuario);
        setToken(token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        localStorage.setItem('token', data.token);
        const rol = (data.usuario.rol || "").toLowerCase().trim();
        

        if (ROLES_ADMIN.includes(rol)) {
            navigate("/admin/productos")
        } else if (rol) {
            navigate("/perfil")
        } else {
            navigate("/login")
        }
        
    } catch (error) {
        toast.error( error.message || 'Error al iniciar sesion.');
    }
};