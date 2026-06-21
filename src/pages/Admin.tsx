import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { api } from '@/lib/api';

interface BuyerUser {
  id: number;
  email: string;
  created_at: string;
  courses_count: number;
}

interface Course {
  id: number;
  title: string;
  emoji: string;
  category: string;
  price: number;
  lessons: number;
}

export default function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<BuyerUser[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'users' | 'courses'>('users');

  // Создание пользователя
  const [newUser, setNewUser] = useState({ email: '', password: '' });
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [newUserLoading, setNewUserLoading] = useState(false);
  const [newUserError, setNewUserError] = useState('');

  // Выдача доступа
  const [grantOpen, setGrantOpen] = useState<BuyerUser | null>(null);
  const [grantCourse, setGrantCourse] = useState('');
  const [grantLoading, setGrantLoading] = useState(false);
  const [grantMsg, setGrantMsg] = useState('');

  const user = api.auth.getUser();

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    Promise.all([api.courses.users(), api.courses.list()])
      .then(([u, c]) => { setUsers(u); setCourses(c); })
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await api.auth.logout();
    navigate('/');
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewUserError('');
    setNewUserLoading(true);
    try {
      await api.courses.createUser(newUser.email, newUser.password);
      const updated = await api.courses.users();
      setUsers(updated);
      setNewUserOpen(false);
      setNewUser({ email: '', password: '' });
    } catch (err: unknown) {
      setNewUserError(err instanceof Error ? err.message : 'Ошибка');
    } finally {
      setNewUserLoading(false);
    }
  };

  const handleGrant = async () => {
    if (!grantOpen || !grantCourse) return;
    setGrantLoading(true);
    setGrantMsg('');
    try {
      await api.courses.grant(grantOpen.email, Number(grantCourse));
      const updated = await api.courses.users();
      setUsers(updated);
      setGrantMsg('Доступ выдан!');
      setTimeout(() => { setGrantOpen(null); setGrantMsg(''); setGrantCourse(''); }, 1000);
    } catch (err: unknown) {
      setGrantMsg(err instanceof Error ? err.message : 'Ошибка');
    } finally {
      setGrantLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://cdn.poehali.dev/projects/b90bb00f-1e3a-45a4-a7ca-21f30a40aa0a/bucket/777220e7-3d3a-4bf8-9299-213e40425b77.jpeg"
              alt="tut_vkusnoru"
              className="h-9 w-9 object-contain mix-blend-multiply"
            />
            <span className="font-display text-xl font-bold tracking-tight">tut_vkusnoru</span>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-medium">Админ</span>
          </Link>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleLogout}>
            <Icon name="LogOut" size={16} />Выйти
          </Button>
        </div>
      </header>

      <main className="container py-10">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="font-display text-4xl font-semibold mb-1">Панель администратора</h1>
            <p className="text-muted-foreground">Управление покупателями и курсами</p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            ['BookOpen', String(courses.length), 'курсов'],
            ['Users', String(users.length), 'покупателей'],
            ['GraduationCap', String(users.reduce((s, u) => s + u.courses_count, 0)), 'выданных доступов'],
          ].map(([icon, value, label]) => (
            <div key={label} className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                <Icon name={icon} size={22} className="text-primary" />
              </div>
              <div>
                <div className="font-display text-2xl font-bold">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-6">
          {(['users', 'courses'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                tab === t ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card text-muted-foreground hover:bg-secondary border border-border'
              }`}
            >
              {t === 'users' ? 'Покупатели' : 'Курсы'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Icon name="Loader2" size={32} className="animate-spin text-primary" />
          </div>
        ) : tab === 'users' ? (
          <>
            <div className="flex justify-end mb-4">
              <Button className="gap-2" onClick={() => setNewUserOpen(true)}>
                <Icon name="UserPlus" size={18} />Добавить покупателя
              </Button>
            </div>
            <div className="bg-card rounded-3xl border border-border overflow-hidden divide-y divide-border">
              {users.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Icon name="Users" size={36} className="mx-auto mb-3 opacity-40" />
                  Покупателей пока нет
                </div>
              ) : users.map((u) => (
                <div key={u.id} className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <Icon name="User" size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{u.email}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {u.courses_count} курс(ов) · с {new Date(u.created_at).toLocaleDateString('ru')}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1 shrink-0" onClick={() => setGrantOpen(u)}>
                    <Icon name="Unlock" size={15} />Выдать курс
                  </Button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-card rounded-3xl border border-border overflow-hidden divide-y divide-border">
            {courses.map((course) => (
              <div key={course.id} className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl shrink-0">
                  {course.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{course.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                    <span>{course.category}</span>
                    <span>{course.lessons} уроков</span>
                    <span className="text-primary font-semibold">{course.price.toLocaleString('ru')} ₽</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* СОЗДАТЬ ПОКУПАТЕЛЯ */}
      <Dialog open={newUserOpen} onOpenChange={(o) => { setNewUserOpen(o); setNewUserError(''); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-semibold">Новый покупатель</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4 py-2">
            <div>
              <Label className="mb-1.5 block">Email</Label>
              <Input
                type="email"
                placeholder="buyer@example.com"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label className="mb-1.5 block">Пароль</Label>
              <Input
                type="text"
                placeholder="Пароль для покупателя"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
              />
            </div>
            {newUserError && (
              <div className="text-destructive text-sm flex items-center gap-2 bg-destructive/10 px-3 py-2 rounded-lg">
                <Icon name="AlertCircle" size={15} />{newUserError}
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewUserOpen(false)}>Отмена</Button>
              <Button type="submit" className="gap-2" disabled={newUserLoading}>
                {newUserLoading ? <Icon name="Loader2" size={16} className="animate-spin" /> : <Icon name="Check" size={16} />}
                Создать
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ВЫДАТЬ КУРС */}
      <Dialog open={!!grantOpen} onOpenChange={(o) => { if (!o) { setGrantOpen(null); setGrantMsg(''); setGrantCourse(''); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-semibold">Выдать доступ к курсу</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-4">
            <div className="bg-secondary/50 rounded-xl px-4 py-3 text-sm">
              <span className="text-muted-foreground">Покупатель: </span>
              <span className="font-medium">{grantOpen?.email}</span>
            </div>
            <div>
              <Label className="mb-1.5 block">Выбрать курс</Label>
              <select
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm"
                value={grantCourse}
                onChange={(e) => setGrantCourse(e.target.value)}
              >
                <option value="">— выберите курс —</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.title}</option>
                ))}
              </select>
            </div>
            {grantMsg && (
              <div className={`text-sm flex items-center gap-2 px-3 py-2 rounded-lg ${
                grantMsg === 'Доступ выдан!' ? 'bg-accent/20 text-accent' : 'bg-destructive/10 text-destructive'
              }`}>
                <Icon name={grantMsg === 'Доступ выдан!' ? 'CheckCircle' : 'AlertCircle'} size={15} />
                {grantMsg}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGrantOpen(null)}>Отмена</Button>
            <Button onClick={handleGrant} disabled={!grantCourse || grantLoading} className="gap-2">
              {grantLoading ? <Icon name="Loader2" size={16} className="animate-spin" /> : <Icon name="Unlock" size={16} />}
              Выдать доступ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
