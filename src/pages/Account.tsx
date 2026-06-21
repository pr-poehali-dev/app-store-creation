import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { api } from '@/lib/api';

interface MyCourse {
  id: number;
  title: string;
  emoji: string;
  lessons_count: number;
  duration: string;
  level: string;
  category: string;
}

export default function Account() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<MyCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<{ title: string; num: number } | null>(null);
  const user = api.auth.getUser();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.courses.my()
      .then(setCourses)
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await api.auth.logout();
    navigate('/');
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
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                <Icon name="User" size={16} className="text-primary" />
              </div>
              <span className="text-muted-foreground">{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleLogout}>
              <Icon name="LogOut" size={16} />Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-10">
        <h1 className="font-display text-4xl font-semibold mb-2">Мои курсы</h1>
        <p className="text-muted-foreground mb-8">Доступ открыт навсегда — учитесь в своём темпе</p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Icon name="Loader2" size={32} className="animate-spin text-primary" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-border">
            <Icon name="BookOpen" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-5">У вас пока нет купленных курсов</p>
            <Button asChild><Link to="/">Перейти в каталог</Link></Button>
          </div>
        ) : (
          <div className="space-y-6">
            {courses.map((course) => {
              const total = course.lessons_count;
              return (
                <div key={course.id} className="bg-card rounded-3xl border border-border overflow-hidden">
                  <div className="p-6 flex items-center gap-5 border-b border-border bg-secondary/30">
                    <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center text-4xl shadow-sm">
                      {course.emoji}
                    </div>
                    <div className="flex-1">
                      <h2 className="font-display text-2xl font-semibold leading-tight mb-2">{course.title}</h2>
                      <div className="flex items-center gap-3">
                        <Progress value={0} className="h-2 max-w-xs" />
                        <span className="text-sm text-muted-foreground whitespace-nowrap">0 из {total}</span>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-border">
                    {Array.from({ length: total }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        onClick={() => setActiveLesson({ title: course.title, num })}
                        className="w-full flex items-center gap-4 p-4 hover:bg-secondary/40 transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0 text-muted-foreground">
                          <Icon name="Play" size={18} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Урок {num}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Icon name="Clock" size={12} /> {course.duration}
                          </div>
                        </div>
                        <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Dialog open={!!activeLesson} onOpenChange={(o) => !o && setActiveLesson(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden gap-0">
          {activeLesson && (
            <>
              <div className="relative aspect-video bg-foreground flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-card/95 flex items-center justify-center shadow-xl cursor-pointer hover-scale">
                  <Icon name="Play" size={32} className="text-primary ml-1" />
                </div>
              </div>
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl font-semibold text-left">
                    Урок {activeLesson.num} — {activeLesson.title}
                  </DialogTitle>
                </DialogHeader>
                <p className="text-muted-foreground mt-3 text-sm">
                  Видео и материалы урока появятся здесь после добавления администратором.
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
