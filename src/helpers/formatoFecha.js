const TZ = "America/Argentina/Catamarca";

// 1) Normaliza lo que te pasen (Date | string | number | Timestamp)
const toDate = (fecha) => {
  if (fecha == null) return null;

  if (fecha instanceof Date) return isNaN(fecha) ? null : fecha;

  if (typeof fecha === "number") {
    const d = new Date(fecha);
    return isNaN(d) ? null : d;
  }

  if (typeof fecha === "string") {
    const s = fecha.trim();

    // a) intento directo (ISO con T y Z/offset)
    let d = new Date(s);
    if (!isNaN(d)) return d;

    // b) fix Safari: "YYYY-MM-DD HH:mm:ss(.SSS)[Z|±HH:MM]" → cambias ' ' por 'T'
    const sT = s.replace(" ", "T");
    d = new Date(sT);
    if (!isNaN(d)) return d;

    // c) si no tiene Z ni offset, asumí UTC (opcional; quítalo si querés tratarlo como local)
    if (!/[zZ]|[+-]\d{2}:\d{2}$/.test(sT)) {
      d = new Date(sT + "Z");
      if (!isNaN(d)) return d;
    }
    return null;
  }

  // d) Firestore-like
  if (typeof fecha === "object" && "seconds" in fecha) {
    const d = new Date(
      fecha.seconds * 1000 + Math.floor((fecha.nanoseconds || 0) / 1e6)
    );
    return isNaN(d) ? null : d;
  }

  return null;
};

// 2) Formateadores
export const formatearFecha = (fecha) => {
  const d = toDate(fecha);
  if (!d) return "";
  try {
    return d.toLocaleDateString("es-AR", {
      timeZone: TZ,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    // si la TZ fuera inválida, caé sin TZ
    return d.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
};

export const formatearFechaHora = (fecha) => {
  const d = toDate(fecha);
  if (!d) return "";
  try {
    return d.toLocaleString("es-AR", {
      timeZone: TZ,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return d.toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
};

export const fechaHora = (fecha) => {
  const d = toDate(fecha);
  if (!d) return "";
  try {
    return d.toLocaleTimeString("es-AR", {
      timeZone: TZ,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return d.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
};