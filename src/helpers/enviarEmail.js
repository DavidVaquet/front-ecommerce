import { enviarEmailServices } from "../services/reciboServices";

export const enviarEmailText = async({email, asunto, mensaje}) => {
    
    try {
        const mail = await enviarEmailServices({email, asunto, mensaje});
        return mail;
    } catch (error) {
        console.error(error);
    }
}