const TOKEN_KEY = 'token';

export function parseServerErrorPayload(data) {
  // Forma de retorno estándar del parser
  const out = { message: null, fieldErrors: null };

  if (!data || typeof data !== "object") {
    return out;
  }

  // A) express-validator: { errores: [{ msg, path, ...}, ...] }
  if (Array.isArray(data.errores) && data.errores.length) {
    out.message = data.msg || data.message || data.error || data.errores[0]?.msg || null;
    out.fieldErrors = data.errores.reduce((acc, e) => {
      const key = e?.path || e?.param; // por compatibilidad
      const msg = e?.msg;
      if (key && msg) acc[key] = msg;
      return acc;
    }, {});
    return out;
  }

  // C) genéricos: { msg } | { message } | { error }
  out.message = data.msg || data.message || data.error || null;
  return out;
}

export class ApiError extends Error {
  constructor(message, { status, data, fieldErrors } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status ?? 0;
    this.data = data ?? null;
    this.fieldErrors = fieldErrors ?? null;
  }
}

export const auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (t) => t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY),
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = '/login';
  },
};


export async function apiFetch(input, init = {}) {
  const token = auth.getToken();
  const url = input instanceof URL ? input.toString() : String(input);

  const headers = new Headers(init.headers || {});
  headers.set("Accept", "application/json");

  const hasBody = !!init.body;
  const isFormData = typeof FormData !== "undefined" && init.body instanceof FormData;
  if (hasBody && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, { ...init, headers });

  // Auth fallida
  if (res.status === 401 || res.status === 403) {
    auth.logout?.();
    throw new ApiError("Sesión expirada. Iniciá sesión nuevamente.", {
      status: res.status,
    });
  }

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    let data = null;
    let fieldErrors = null;

    try {
      if (isJson) {
        data = await res.json();
        const parsed = parseServerErrorPayload(data); // soporta A + C
        message = parsed.message || message;
        fieldErrors = parsed.fieldErrors;
      } else {
        // backend devolvió HTML o texto (pasa mucho en 500)
        const text = await res.text();
        message = text?.trim() || message;
      }
    } catch {
      // si no pudimos parsear nada, dejamos message por defecto
    }

    // Si es 5xx y no vino msg, dale un fallback humano
    if (res.status >= 500 && (!message || /^HTTP\s+\d+$/i.test(message))) {
      message = "Error interno del servidor";
    }

    throw new ApiError(message, { status: res.status, data, fieldErrors });
  }

  return isJson ? res.json() : res;
}