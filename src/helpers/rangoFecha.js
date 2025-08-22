const pad2 = (n) => (n < 10 ? "0" : "") + n;

const formatYMDLocal = (d) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const startOfDayLocal = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0,0,0,0);
const endOfDayLocal   = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23,59,59,999);

// Lunes como inicio de semana (ARG)
const startOfWeekLocal = (d, weekStartsOn = 1) => {
  const day = d.getDay(); // 0=Dom..6=Sáb
  const diff = (day - weekStartsOn + 7) % 7;
  const s = new Date(d);
  s.setDate(d.getDate() - diff);
  return startOfDayLocal(s);
};

const startOfMonthLocal = (d) => new Date(d.getFullYear(), d.getMonth(), 1);

// Trimestre calendario: Ene-Mar, Abr-Jun, Jul-Sep, Oct-Dic
const startOfQuarterLocal = (d) => {
  const qStartMonth = Math.floor(d.getMonth() / 3) * 3;
  return new Date(d.getFullYear(), qStartMonth, 1);
};

// period: "hoy" | "semana" | "mes" | "trimestre"
export const computeRange = (period, now = new Date()) => {
  const end = endOfDayLocal(now);
  let start;

  switch (period) {
    case "hoy":
      start = startOfDayLocal(now);
      break;
    case "semana":
      start = startOfWeekLocal(now, 1); // lunes
      break;
    case "mes":
      start = startOfMonthLocal(now);
      break;
    case "trimestre":
      start = startOfQuarterLocal(now);
      break;
    default:
      start = startOfDayLocal(now);
  }

  return {
    // Date por si querés usar toISOString()
    startDate: start,
    endDate: end,
    // Strings YYYY-MM-DD locales, ideales para tu API
    fechaDesde: formatYMDLocal(start),
    fechaHasta: formatYMDLocal(end),
  };
};