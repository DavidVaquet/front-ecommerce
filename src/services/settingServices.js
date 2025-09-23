const API_URL = `${import.meta.env.VITE_API_URL}/settings`;
import { apiFetch } from "../helpers/auth";


export const getSettingsCompany = async () => {

    try {
        const res = await apiFetch(`${API_URL}/company-settings`);
        return res;
    } catch (error) {
        console.error(error);
    }
}

export const patchSettingsCompany = async (orgId, {name, direction, telefono, website, email_empresa, tax_id, logoFile, timezone, date_format}) => {
    try {

        const fd = new FormData();
        fd.set('name', name);
        fd.set('direction', direction);
        fd.set('telefono', telefono);
        fd.set('website', website);
        fd.set('email_empresa', email_empresa);
        fd.set('tax_id', tax_id);
        fd.set('timezone', timezone);
        fd.set('date_format', date_format);

        if (logoFile instanceof File) {
            fd.set('logo', logoFile);
        }
        const res = await apiFetch(`${API_URL}/edit-company-settings/${orgId}`, {
            method: 'PATCH',
            body: fd
        });
        return res;
    } catch (error) {
        console.error(error);
    }
}

export const patchSettingsInventory = async (orgId, payload) => {
    try {
        const res = await apiFetch(`${API_URL}/edit-inventory-settings/${orgId}`, {
            method: 'PATCH',
            body: JSON.stringify(payload)
        })

        return res;
    } catch (error) {
        console.error(error);
    }
}

export const patchSettingsVentas = async (orgId, payload) => {
    try {
        const res = await apiFetch(`${API_URL}/edit-sales-settings/${orgId}`, {
            method: 'PATCH',
            body: JSON.stringify(payload)
        })

        return res;
    } catch (error) {
        console.error(error);
    }
}