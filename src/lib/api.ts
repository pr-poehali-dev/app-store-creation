const URLS = {
  auth: 'https://functions.poehali.dev/47a537c4-607c-4e21-a55b-f4e51e49a692',
  courses: 'https://functions.poehali.dev/32ee6ad5-cfe5-4f93-b24d-fd4cf847c108',
};

function getSession(): string {
  return localStorage.getItem('session_id') || '';
}

function headers(): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  const s = getSession();
  if (s) h['X-Session-Id'] = s;
  return h;
}

export const api = {
  auth: {
    async login(email: string, password: string) {
      const res = await fetch(`${URLS.auth}?action=login`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка входа');
      localStorage.setItem('session_id', data.session_id);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    },

    async me() {
      const res = await fetch(`${URLS.auth}?action=me`, { headers: headers() });
      if (!res.ok) return null;
      return res.json();
    },

    async logout() {
      await fetch(`${URLS.auth}?action=logout`, { method: 'POST', headers: headers() });
      localStorage.removeItem('session_id');
      localStorage.removeItem('user');
    },

    getUser() {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    },
  },

  courses: {
    async list() {
      const res = await fetch(`${URLS.courses}?action=list`);
      return res.json();
    },

    async my() {
      const res = await fetch(`${URLS.courses}?action=my`, { headers: headers() });
      if (!res.ok) throw new Error('Не авторизован');
      return res.json();
    },

    async users() {
      const res = await fetch(`${URLS.courses}?action=users`, { headers: headers() });
      if (!res.ok) throw new Error('Доступ запрещён');
      return res.json();
    },

    async grant(email: string, course_id: number) {
      const res = await fetch(`${URLS.courses}?action=grant`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ email, course_id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка');
      return data;
    },

    async createUser(email: string, password: string) {
      const res = await fetch(`${URLS.courses}?action=create-user`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка');
      return data;
    },
  },
};
