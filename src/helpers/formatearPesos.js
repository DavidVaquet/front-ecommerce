export const formatearPesos = (numero) => {
    return parseFloat(numero).toLocaleString('es-AR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})    
}

export const formatearPesosRedondeo = (numero) => {
  return Math.round(numero).toLocaleString('es-AR');
}

export const formatearMiles = (valor) => {
  const soloNumeros = String(valor ?? "")
    .replace(/\D/g, "");

  if (!soloNumeros) return "";

  return new Intl.NumberFormat("es-AR").format(Number(soloNumeros));
};

export function precioToNumber(precioStr) {
  if (!precioStr) return 0;
  return Number(String(precioStr).replace(/\./g, "").replace(",", ".")); 
}