export const formatearPesos = (numero) => {
    return parseFloat(numero).toLocaleString('es-AR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})    
}

export const formatearPesosRedondeo = (numero) => {
  return Math.round(numero).toLocaleString('es-AR');
}