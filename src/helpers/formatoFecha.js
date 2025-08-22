const TZ = "America/Argentina/Catamarca";

export const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString("es-AR", {
    timeZone: TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatearFechaHora = (fecha) => {
  return new Date(fecha).toLocaleString("es-AR", {
    timeZone: TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,       
  });
};

export const fechaHora = (fecha) => {
  if (!fecha) return "";
  return new Date(fecha).toLocaleTimeString("es-AR", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,         
  });
};
