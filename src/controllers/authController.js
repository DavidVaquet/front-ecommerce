import { login } from "../services/authServices";


export const loginController = async ({email, password, toast, setUser, navigate}) => {

    try {
        const data = await login({email, password});
        setUser(data.usuario);
        navigate('/admin');
    } catch (error) {
        toast.error( error.message || 'Error al iniciar sesion.');
    }
};