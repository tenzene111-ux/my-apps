const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }

  getToken() {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  private async request(path: string, options: RequestInit = {}) {
    const token = this.getToken();
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message);
    }
    return res.json();
  }

  get(path: string) { return this.request(path); }
  post(path: string, data: any) { return this.request(path, { method: 'POST', body: JSON.stringify(data) }); }
  put(path: string, data: any) { return this.request(path, { method: 'PUT', body: JSON.stringify(data) }); }
  delete(path: string) { return this.request(path, { method: 'DELETE' }); }

  async uploadProduct(formData: FormData) {
    const token = this.getToken();
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  }
}

export const api = new ApiClient();
