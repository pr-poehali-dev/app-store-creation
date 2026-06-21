import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.auth.login(email, password);
      navigate(data.user.role === 'admin' ? '/admin' : '/account');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-6 left-6">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <Icon name="ArrowLeft" size={18} />
          На главную
        </Link>
      </div>

      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <img
            src="https://cdn.poehali.dev/projects/b90bb00f-1e3a-45a4-a7ca-21f30a40aa0a/bucket/777220e7-3d3a-4bf8-9299-213e40425b77.jpeg"
            alt="tut_vkusnoru"
            className="h-14 w-14 object-contain mx-auto mb-3 mix-blend-multiply"
          />
          <h1 className="font-display text-4xl font-semibold mb-2">Вход в кабинет</h1>
          <p className="text-muted-foreground">Доступ к вашим курсам и управлению</p>
        </div>

        <div className="bg-card rounded-3xl border border-border p-7 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="mb-1.5 block">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-background"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="mb-1.5 block">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-background"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-4 py-3 rounded-xl">
                <Icon name="AlertCircle" size={16} />
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full h-12 gap-2" disabled={loading}>
              {loading ? <Icon name="Loader2" size={18} className="animate-spin" /> : <Icon name="ArrowRight" size={18} />}
              {loading ? 'Входим...' : 'Войти'}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-5 flex items-center justify-center gap-1.5">
            <Icon name="Info" size={14} />
            Логин и пароль приходят на email и в Telegram после оплаты
          </p>
        </div>
      </div>
    </div>
  );
}
