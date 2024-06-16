class ApiClient {
  constructor() {
    this.baseURL = import.meta.env.VITE_BASE_URL;
  }

  async get(url: string, options = {}) {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    const data = await response.json();
    return data;
  }

  async post(url: string, body: { name: string; email: string; password: string; }, options = {}) {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include', // Include credentials (cookies) on both sides
    });
    const responseData = await response.json();
    return responseData
  }

  async put(url: any, body: any, options = {}) {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  }

  async delete(url: any, options = {}) {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
  }

  addCookie(options: { headers?: any; }) {
    const token = this.getCookie('auth_token');
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return options
  }

  getCookie(name: string | any[]) {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${name}=`)) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  }
}

const Api = new ApiClient();
export default Api;