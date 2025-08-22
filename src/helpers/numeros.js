export const formatearEntero = (numero, {currency = "ARS"} = {}) => {
    const n = Number(numero);
    if (!Number.isFinite(n)) return "";
    return new Intl.NumberFormat('es-AR', {
        style: 'decimal',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(n)
};