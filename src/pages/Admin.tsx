import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface AdminCourse {
  id: number;
  title: string;
  category: string;
  price: number;
  lessons: number;
  emoji: string;
  desc: string;
}

const INITIAL: AdminCourse[] = [
  { id: 1, title: 'Как готовить с нуля, если ты новичок', category: 'Для новичков', price: 2990, lessons: 6, emoji: '🍳', desc: '6 базовых блюд с подробными видеоуроками.' },
  { id: 2, title: 'Идеальные завтраки за 15 минут', category: 'Завтраки', price: 1990, lessons: 8, emoji: '🥞', desc: 'Быстрые и полезные завтраки на каждый день.' },
  { id: 3, title: 'Горячие блюда уровня ресторана', category: 'Горячее', price: 3990, lessons: 10, emoji: '🍲', desc: 'Стейки, рагу, запечённая рыба и гарниры.' },
  { id: 4, title: 'Десерты, которые впечатлят гостей', category: 'Десерты', price: 3490, lessons: 7, emoji: '🍰', desc: 'Чизкейки, тарты, муссовые торты и мороженое.' },
];

const empty: AdminCourse = { id: 0, title: '', category: '', price: 0, lessons: 0, emoji: '🍽️', desc: '' };

export default function Admin() {
  const [courses, setCourses] = useState<AdminCourse[]>(INITIAL);
  const [editing, setEditing] = useState<AdminCourse | null>(null);
  const [confirmDel, setConfirmDel] = useState<AdminCourse | null>(null);

  const stats = [
    ['BookOpen', courses.length, 'курсов'],
    ['Users', '1 248', 'учеников'],
    ['Wallet', '3.7 млн ₽', 'выручка'],
  ] as const;

  const save = () => {
    if (!editing) return;
    if (editing.id === 0) {
      setCourses([...courses, { ...editing, id: Date.now() }]);
    } else {
      setCourses(courses.map((c) => (c.id === editing.id ? editing : c)));
    }
    setEditing(null);
  };

  const remove = () => {
    if (!confirmDel) return;
    setCourses(courses.filter((c) => c.id !== confirmDel.id));
    setConfirmDel(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🧑‍🍳</span>
            <span className="font-display text-xl font-bold tracking-tight">Готовим с нуля</span>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-medium">Админ</span>
          </Link>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link to="/login"><Icon name="LogOut" size={16} />Выйти</Link>
          </Button>
        </div>
      </header>

      <main className="container py-10">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="font-display text-4xl font-semibold mb-1">Управление курсами</h1>
            <p className="text-muted-foreground">Добавляйте, редактируйте и удаляйте курсы</p>
          </div>
          <Button size="lg" className="gap-2" onClick={() => setEditing({ ...empty })}>
            <Icon name="Plus" size={18} />Добавить курс
          </Button>
        </div>

        {/* STATS */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {stats.map(([icon, value, label]) => (
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

        {/* COURSE LIST */}
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
              <Button variant="ghost" size="icon" onClick={() => setEditing(course)}>
                <Icon name="Pencil" size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setConfirmDel(course)}>
                <Icon name="Trash2" size={18} />
              </Button>
            </div>
          ))}
        </div>
      </main>

      {/* EDIT/CREATE MODAL */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-semibold">
              {editing?.id === 0 ? 'Новый курс' : 'Редактировать курс'}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4 py-2">
              <div className="flex gap-3">
                <div className="w-20">
                  <Label className="mb-1.5 block">Эмодзи</Label>
                  <Input value={editing.emoji} onChange={(e) => setEditing({ ...editing, emoji: e.target.value })} className="text-center text-xl" />
                </div>
                <div className="flex-1">
                  <Label className="mb-1.5 block">Название</Label>
                  <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                </div>
              </div>
              <div>
                <Label className="mb-1.5 block">Описание</Label>
                <Textarea value={editing.desc} onChange={(e) => setEditing({ ...editing, desc: e.target.value })} rows={3} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="mb-1.5 block">Категория</Label>
                  <Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
                </div>
                <div>
                  <Label className="mb-1.5 block">Цена ₽</Label>
                  <Input type="number" value={editing.price || ''} onChange={(e) => setEditing({ ...editing, price: +e.target.value })} />
                </div>
                <div>
                  <Label className="mb-1.5 block">Уроков</Label>
                  <Input type="number" value={editing.lessons || ''} onChange={(e) => setEditing({ ...editing, lessons: +e.target.value })} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Отмена</Button>
            <Button onClick={save} className="gap-2"><Icon name="Check" size={18} />Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRM */}
      <Dialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-semibold">Удалить курс?</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            Курс «{confirmDel?.title}» будет удалён. Это действие нельзя отменить.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDel(null)}>Отмена</Button>
            <Button variant="destructive" onClick={remove} className="gap-2">
              <Icon name="Trash2" size={18} />Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
