const TOKEN_KEY = 'token';

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
  headers.set('Accept', 'application/json');

  
  const hasBody = !!init.body;
  const isFormData = typeof FormData !== 'undefined' && init.body instanceof FormData;
  if (hasBody && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  
  const res = await fetch(url, { ...init, headers });

  
  if (res.status === 401 || res.status === 403) {
    auth.logout();
    throw new Error('Sesión expirada. Iniciá sesión nuevamente.');
  }

  
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!res.ok) {
    let serverMsg = `HTTP ${res.status}`;
    try {
      if (isJson) {
        const data = await res.json();
        serverMsg = data?.msg || data?.error || data?.message || serverMsg;
      } else {
        const text = await res.text();
        serverMsg = text || serverMsg;
      }
    } catch {
      
    }
    throw new Error(serverMsg);
  }

  
  if (isJson) {
    return res.json();
  }
  return res; 
}