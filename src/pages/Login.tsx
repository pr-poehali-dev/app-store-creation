import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'buyer' | 'admin'>('buyer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(role === 'admin' ? '/admin' : '/account');
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
          <div className="text-4xl mb-3">🧑‍🍳</div>
          <h1 className="font-display text-4xl font-semibold mb-2">Вход в кабинет</h1>
          <p className="text-muted-foreground">Доступ к вашим курсам и управлению</p>
        </div>

        <div className="bg-card rounded-3xl border border-border p-7 shadow-xl">
          {/* ROLE SWITCH */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-secondary/60 rounded-2xl mb-6">
            {([['buyer', 'Покупатель', 'User'], ['admin', 'Администратор', 'Shield']] as const).map(
              ([key, label, icon]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRole(key)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                    role === key
                      ? 'bg-card text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={icon} size={16} />
                  {label}
                </button>
              )
            )}
          </div>

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
              />
            </div>
            <Button type="submit" size="lg" className="w-full h-12 gap-2">
              Войти
              <Icon name="ArrowRight" size={18} />
            </Button>
          </form>

          {role === 'buyer' && (
            <p className="text-xs text-muted-foreground text-center mt-5 flex items-center justify-center gap-1.5">
              <Icon name="Info" size={14} />
              Логин и пароль приходят на email и в Telegram после оплаты
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
