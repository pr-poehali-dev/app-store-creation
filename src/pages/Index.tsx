import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/b90bb00f-1e3a-45a4-a7ca-21f30a40aa0a/files/fd8af84c-d861-43fb-8580-942f2d11500a.jpg';

const CATEGORIES = ['Все', 'Для новичков', 'Завтраки', 'Горячее', 'Десерты'];

interface Course {
  id: number;
  title: string;
  category: string;
  lessons: number;
  duration: string;
  price: number;
  oldPrice?: number;
  desc: string;
  emoji: string;
  level: string;
}

const COURSES: Course[] = [
  {
    id: 1,
    title: 'Как готовить с нуля, если ты новичок',
    category: 'Для новичков',
    lessons: 6,
    duration: '3 часа',
    price: 2990,
    oldPrice: 4990,
    desc: '6 базовых блюд с подробными видеоуроками и пошаговой инструкцией. Идеально для тех, кто только начинает.',
    emoji: '🍳',
    level: 'Старт',
  },
  {
    id: 2,
    title: 'Идеальные завтраки за 15 минут',
    category: 'Завтраки',
    lessons: 8,
    duration: '2 часа',
    price: 1990,
    desc: 'Быстрые и полезные завтраки на каждый день: омлеты, сырники, гранола и авторские тосты.',
    emoji: '🥞',
    level: 'Легко',
  },
  {
    id: 3,
    title: 'Горячие блюда уровня ресторана',
    category: 'Горячее',
    lessons: 10,
    duration: '5 часов',
    price: 3990,
    desc: 'Стейки, рагу, запечённая рыба и гарниры. Готовим как шеф-повар прямо у себя дома.',
    emoji: '🍲',
    level: 'Средний',
  },
  {
    id: 4,
    title: 'Десерты, которые впечатлят гостей',
    category: 'Десерты',
    lessons: 7,
    duration: '4 часа',
    price: 3490,
    desc: 'Чизкейки, тарты, муссовые торты и домашнее мороженое. Подробно о текстурах и декоре.',
    emoji: '🍰',
    level: 'Средний',
  },
];

const FAQ = [
  {
    q: 'Как я получу доступ к курсу после оплаты?',
    a: 'Сразу после оплаты на ваш email и в Telegram придёт логин и пароль от личного кабинета, где открыты все видеоуроки купленного курса.',
  },
  {
    q: 'Какими способами можно оплатить?',
    a: 'Оплата проходит через Робокассу: банковская карта, СБП, электронные кошельки и другие удобные способы.',
  },
  {
    q: 'Нужен ли опыт в готовке?',
    a: 'Нет. Курсы для новичков начинаются с самых основ — мы объясняем каждый шаг максимально подробно.',
  },
  {
    q: 'Доступ к видео навсегда?',
    a: 'Да, после покупки уроки доступны в вашем личном кабинете без ограничения по времени.',
  },
];

export default function Index() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('Все');
  const [selected, setSelected] = useState<Course | null>(null);

  const filtered = COURSES.filter((c) => {
    const matchCat = activeCat === 'Все' || c.category === activeCat;
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-background">
      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧑‍🍳</span>
            <span className="font-display text-2xl font-bold tracking-tight">
              Готовим с нуля
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <button onClick={() => scrollTo('courses')} className="hover:text-primary transition-colors">Курсы</button>
            <button onClick={() => scrollTo('faq')} className="hover:text-primary transition-colors">Вопросы</button>
            <button onClick={() => scrollTo('contacts')} className="hover:text-primary transition-colors">Контакты</button>
          </nav>
          <Button variant="outline" size="sm" className="gap-2">
            <Icon name="User" size={16} />
            Кабинет
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container grid md:grid-cols-2 gap-12 items-center py-16 md:py-24">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Видеокурсы по приготовлению блюд
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight text-balance mb-6">
              Научись готовить{' '}
              <span className="text-primary italic">вкусно</span> с нуля
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mb-8">
              Пошаговые видеоуроки, которые превратят кухню в любимое место.
              От первого блюда до уровня шефа.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="gap-2 text-base h-12 px-7" onClick={() => scrollTo('courses')}>
                Выбрать курс
                <Icon name="ArrowRight" size={18} />
              </Button>
              <Button size="lg" variant="ghost" className="gap-2 text-base h-12" onClick={() => scrollTo('courses')}>
                <Icon name="Play" size={18} />
                Смотреть превью
              </Button>
            </div>
            <div className="flex items-center gap-8 mt-10">
              {[['31', 'видеоурок'], ['4', 'курса'], ['1200+', 'учеников']].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-3xl font-semibold text-foreground">{n}</div>
                  <div className="text-sm text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative animate-scale-in">
            <div className="absolute -inset-4 bg-primary/10 rounded-[2rem] rotate-3" />
            <img
              src={HERO_IMG}
              alt="Кулинария"
              className="relative rounded-[2rem] shadow-2xl object-cover aspect-square w-full"
            />
            <div className="absolute -bottom-5 -left-5 bg-card shadow-xl rounded-2xl px-5 py-4 flex items-center gap-3 animate-fade-in">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Icon name="ChefHat" size={20} className="text-accent" />
              </div>
              <div>
                <div className="font-semibold text-sm">Доступ навсегда</div>
                <div className="text-xs text-muted-foreground">после оплаты</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" className="container py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-4">
            Каталог курсов
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Выбери направление и начни готовить уже сегодня
          </p>
        </div>

        {/* SEARCH + FILTERS */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative mb-6">
            <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Найти курс..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 bg-card rounded-full border-border"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCat === cat
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-card text-muted-foreground hover:bg-secondary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* GRID */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {filtered.map((course) => (
            <article
              key={course.id}
              className="group bg-card rounded-3xl overflow-hidden border border-border hover:shadow-2xl transition-all duration-300 hover-scale cursor-pointer"
              onClick={() => setSelected(course)}
            >
              <div className="relative aspect-video bg-gradient-to-br from-secondary to-muted flex items-center justify-center overflow-hidden">
                <span className="text-7xl group-hover:scale-110 transition-transform duration-500">
                  {course.emoji}
                </span>
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-card/90 backdrop-blur text-xs font-semibold">
                  {course.category}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-foreground/10">
                  <div className="w-14 h-14 rounded-full bg-card flex items-center justify-center shadow-lg">
                    <Icon name="Play" size={22} className="text-primary ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl font-semibold mb-2 leading-tight">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {course.desc}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Icon name="Video" size={14} /> {course.lessons} уроков
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Clock" size={14} /> {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="TrendingUp" size={14} /> {course.level}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl font-bold text-primary">
                      {course.price.toLocaleString('ru')} ₽
                    </span>
                    {course.oldPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {course.oldPrice.toLocaleString('ru')} ₽
                      </span>
                    )}
                  </div>
                  <Button size="sm" className="gap-1">
                    Подробнее
                    <Icon name="ChevronRight" size={16} />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Icon name="SearchX" size={40} className="mx-auto mb-3 opacity-50" />
            Курсы не найдены. Попробуйте изменить запрос.
          </div>
        )}
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-secondary/40 py-16 md:py-24">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="font-display text-4xl md:text-5xl font-semibold mb-4">
              Частые вопросы
            </h2>
            <p className="text-muted-foreground">Всё, что нужно знать перед покупкой</p>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQ.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-card rounded-2xl border border-border px-6"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CONTACTS / CTA */}
      <section id="contacts" className="container py-16 md:py-24">
        <div className="bg-primary rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 text-[12rem] opacity-10 leading-none">🍴</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary-foreground mb-4 relative">
            Остались вопросы?
          </h2>
          <p className="text-primary-foreground/80 max-w-md mx-auto mb-8 relative">
            Напишите нам — поможем выбрать курс и расскажем о доступе
          </p>
          <div className="flex flex-wrap justify-center gap-4 relative">
            <Button size="lg" variant="secondary" className="gap-2 h-12">
              <Icon name="Send" size={18} /> Telegram
            </Button>
            <Button size="lg" variant="secondary" className="gap-2 h-12">
              <Icon name="Mail" size={18} /> hello@gotovim.ru
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border">
        <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧑‍🍳</span>
            <span className="font-display text-lg font-semibold text-foreground">Готовим с нуля</span>
          </div>
          <span>© 2026 Все права защищены</span>
        </div>
      </footer>

      {/* COURSE DETAIL MODAL */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0">
          {selected && (
            <>
              <div className="relative aspect-video bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                <span className="text-8xl">{selected.emoji}</span>
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/10">
                  <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center shadow-lg cursor-pointer hover-scale">
                    <Icon name="Play" size={26} className="text-primary ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-foreground/70 text-background text-xs">
                  Превью урока
                </div>
              </div>
              <div className="p-6 md:p-8">
                <DialogHeader>
                  <div className="text-xs font-semibold text-primary mb-2">{selected.category}</div>
                  <DialogTitle className="font-display text-3xl font-semibold leading-tight text-left">
                    {selected.title}
                  </DialogTitle>
                  <DialogDescription className="text-base text-muted-foreground text-left pt-2">
                    {selected.desc}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-3 gap-3 my-6">
                  {[
                    ['Video', `${selected.lessons} уроков`],
                    ['Clock', selected.duration],
                    ['TrendingUp', selected.level],
                  ].map(([icon, label]) => (
                    <div key={label} className="bg-secondary/60 rounded-xl p-3 text-center">
                      <Icon name={icon} size={18} className="mx-auto mb-1 text-primary" />
                      <div className="text-xs font-medium">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-secondary/40 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-3xl font-bold text-primary">
                      {selected.price.toLocaleString('ru')} ₽
                    </span>
                    {selected.oldPrice && (
                      <span className="text-muted-foreground line-through">
                        {selected.oldPrice.toLocaleString('ru')} ₽
                      </span>
                    )}
                  </div>
                  <Button size="lg" className="gap-2 h-12 px-7">
                    <Icon name="CreditCard" size={18} />
                    Купить и получить доступ
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1.5">
                  <Icon name="ShieldCheck" size={14} />
                  Оплата картой и СБП через Робокассу. Доступ придёт на email и в Telegram
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
