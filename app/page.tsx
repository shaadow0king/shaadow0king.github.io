"use client";

import Image from "next/image";
import { ArrowDown, ArrowRight, Bug, MousePointerClick } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";

type Language = "ru" | "en";
type Copy = { ru: string; en: string };
type TabId = "home" | "experience" | "skills" | "about";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const asset = (path: string) => `${basePath}${path}`;
const localize = (value: Copy, language: Language) => value[language];

const copy = {
  name: { ru: "Геворк Акопян", en: "Gevork Akopyan" },
  location: { ru: "QA · Белград", en: "QA · Belgrade" },
  tabs: {
    home: { ru: "Главная", en: "Home" },
    experience: { ru: "Опыт", en: "Experience" },
    skills: { ru: "Навыки", en: "Skills" },
    about: { ru: "Обо мне", en: "About" },
  },
  hero: {
    intro: {
      ru: "Тестирую мобильные игры и приложения на Android, iOS и Huawei. Слежу за стабильностью, UX/UI и логикой.",
      en: "I test mobile games and apps on Android, iOS and Huawei, with an eye on stability, UX/UI and logic.",
    },
    quoteStart: { ru: "Но чаще всего на что-то жму", en: "Usually I press something" },
    quoteEnd: { ru: "— и всё ломается.", en: "— and everything breaks." },
  },
  cv: {
    title: { ru: "Резюме", en: "Resume" },
    version: { ru: "PDF · RU", en: "PDF · EN" },
    description: {
      ru: "Полная версия резюме: опыт, инструменты и контакты.",
      en: "The full resume: experience, tools and contacts.",
    },
    aria: { ru: "Скачать резюме в PDF", en: "Download resume as PDF" },
  },
  products: {
    title: { ru: "Продукты", en: "Products" },
    description: {
      ru: "Которые я создаю с помощью AI.",
      en: "That I build with AI.",
    },
  },
  experience: {
    label: { ru: "Опыт работы", en: "Work experience" },
    present: { ru: "наст. время", en: "present" },
    intro: {
      ru: "От тестирования фич до мониторинга релизов, проверки аналитики и наставничества.",
      en: "From feature testing to release monitoring, analytics validation and mentoring.",
    },
    current: { ru: "Текущее место работы, подробности позже.", en: "Current role, details coming soon." },
  },
  skills: {
    label: { ru: "Навыки и инструменты", en: "Skills & tools" },
    intro: {
      ru: "Инструменты, с которыми работаю на этапах анализа требований, тестирования, диагностики, аналитики и релизов.",
      en: "Tools I use across requirements analysis, testing, diagnostics, analytics and releases.",
    },
  },
  about: {
    paragraphs: [
      {
        ru: "Тестирую приложения на Android, iOS и Huawei. Оцениваю стабильность, воспроизводимость и влияние ошибок на пользовательский опыт, уделяю внимание UX/UI и логике работы приложений.",
        en: "I test applications across Android, iOS and Huawei. I assess stability, reproducibility and the impact of defects on user experience, with attention to UX/UI and application behavior and logic.",
      },
      {
        ru: "Работаю на всём релизном цикле: от анализа требований и тест-документации до регресса, проверки аналитики и мониторинга после выпуска.",
        en: "I work across the whole release cycle: from requirements analysis and test documentation to regression, analytics validation and post-release monitoring.",
      },
    ] as Copy[],
    quote: { ru: "Но чаще всего на что-то жму — и всё ломается.", en: "Usually I press something — and everything breaks." },
    connect: { ru: "Связаться", en: "Connect" },
    cvRu: { ru: "Резюме RU", en: "CV RU" },
    cvEn: { ru: "Резюме EN", en: "CV EN" },
  },
  cta: { ru: "Контакты", en: "Contact" },
  ctaMessage: { ru: "Написать мне", en: "Message me" },
  boot: { ru: "Сайт загружен на", en: "Site loaded" },
  langGroup: { ru: "Выбор языка", en: "Language selector" },
  tabsGroup: { ru: "Разделы резюме", en: "CV sections" },
};

type Job = {
  company: string;
  logo: string;
  role: string;
  start: [number, number];
  end?: [number, number];
  summary?: Copy;
  bullets: Copy[];
};

const jobs: Job[] = [
  {
    company: "Glam AI",
    logo: "glam-ai",
    role: "QA Specialist",
    start: [2025, 7],
    bullets: [
      {
        ru: "QA в Glam AI, одном из топ-10 приложений категории Photo & Video в App Store по всему миру: 18 млн установок и 2 млн активных пользователей в месяц (MAU)",
        en: "QA at Glam AI, a top-10 Photo & Video app on the App Store worldwide: 18M installs and 2M monthly active users (MAU)",
      },
      {
        ru: "Обеспечивал стабильную работу воронок продаж и подписок (пейволы, покупки, пробные периоды, продление, отмена, оплата банковскими картами), что поддерживало рост выручки, retention и притока новых пользователей",
        en: "Kept sales funnels and subscriptions bug-free (paywalls, purchases, trials, renewals, cancellations, bank-card payments), supporting revenue, retention and new-user growth",
      },
      {
        ru: "Участвовал в улучшении Daily Shots: повторное использование среди платящих выросло с 7% до 58%",
        en: "Improved Daily Shots: reuse among paying users grew from 7% to 58%",
      },
      {
        ru: "Использовал ИИ-помощников в ежедневной работе: код-ревью с Claude, составление тест-кейсов и документации, автоматизированные проверки",
        en: "Used AI assistants daily: code review with Claude, test-case and documentation writing, automated checks",
      },
      {
        ru: "Улучшал QA-процессы и работу с задачами в Notion, что ускорило работу команды",
        en: "Improved QA processes and task management in Notion, speeding up the team's work",
      },
      {
        ru: "Ручное тестирование iOS-приложения, API и интеграций с бэкендом, включая AI/ML-функции обработки фото и видео; функциональные, регрессионные, smoke- и исследовательские проверки перед еженедельными релизами",
        en: "Manual testing of the iOS app, APIs and backend integrations, including AI/ML photo and video features; functional, regression, smoke and exploratory testing for weekly releases",
      },
      {
        ru: "Проверка API и серверной логики в Postman, Charles Proxy и Proxyman",
        en: "API and backend testing with Postman, Charles Proxy and Proxyman",
      },
      {
        ru: "Работа с консолью, установка и проверка сборок (Xcode, TestFlight), Git, участие в CI/CD-релизах",
        en: "Command line, build installation and verification (Xcode, TestFlight), Git and CI/CD releases",
      },
      {
        ru: "Разбор и воспроизведение продакшен-дефектов вместе с iOS-, backend-, ML-командами, поддержкой и продуктом",
        en: "Investigated and reproduced production defects with iOS, backend, ML, support and product teams",
      },
      {
        ru: "Firebase, Bugsnag, Adapty и Amplitude для проверки стабильности, подписок и продуктовых сценариев",
        en: "Firebase, Bugsnag, Adapty and Amplitude to validate stability, subscriptions and product flows",
      },
    ],
  },
  {
    company: "Playrix",
    logo: "playrix",
    role: "QA Specialist",
    start: [2023, 10],
    end: [2025, 5],
    bullets: [
      { ru: "Тестирование LiveOps: ивенты и регулярные обновления, поддерживающие рост числа игроков", en: "LiveOps testing: events and regular updates that supported player-base growth" },
      { ru: "Снижение количества багов от релиза к релизу и стабильность сборок", en: "Fewer bugs from release to release and stable builds" },
      { ru: "Тестирование монетизации и внутриигровых покупок: улучшения дали +10% к покупкам", en: "Monetization and in-app purchase testing: improvements lifted purchases by 10%" },
      { ru: "Ручное тестирование на iOS, Android и Huawei", en: "Manual testing on iOS, Android and Huawei" },
      { ru: "Анализ требований и декомпозиция для проверки соответствия ТЗ", en: "Requirements analysis and decomposition to verify specification compliance" },
      { ru: "Тест-кейсы, чек-листы, тест-планы и баг-репорты в Asana", en: "Test cases, checklists, test plans and bug reports in Asana" },
      { ru: "A/B-тестирование и проверка аналитических событий в Amplitude и Swrve", en: "A/B testing and analytics-event validation in Amplitude and Swrve" },
      { ru: "Тестирование серверной и клиентской игровой логики, релизный регресс", en: "Server and client game-logic testing and release regression" },
      { ru: "Анализ трафика, перехват и подмена запросов через Charles Proxy", en: "Traffic analysis, request interception and modification with Charles Proxy" },
      { ru: "Анализ сбоев и нефатальных ошибок в Sentry", en: "Crash and non-fatal error analysis in Sentry" },
      { ru: "Изменение тестовых серверов через Git для подготовки окружения и настройки событий", en: "Git-based test-server changes for environment and event setup" },
    ],
  },
  {
    company: "Playgendary",
    logo: "playgendary",
    role: "QA Specialist",
    start: [2023, 4],
    end: [2023, 8],
    bullets: [
      { ru: "Ручное тестирование на Android и iOS", en: "Manual testing on Android and iOS" },
      { ru: "Тестирование аналитики: сырые данные Adjust и конфигурации Firebase", en: "Analytics testing with Adjust raw data and Firebase configurations" },
      { ru: "Выявление 60+ дефектов в месяц в рамках KPI", en: "Identified 60+ defects per month as part of KPI" },
      { ru: "Установка, логирование и проверка сборок в Android Studio и Xcode", en: "Build installation, logging and verification in Android Studio and Xcode" },
      { ru: "Баг-репорты в Asana и работа с системой контроля версий Git", en: "Bug reporting in Asana and version-control work with Git" },
      { ru: "Тестовая документация и обновление тест-ранов в TestRail", en: "Test documentation and test-run updates in TestRail" },
      { ru: "Выпуск проектов в продакшен и последующий мониторинг", en: "Production releases and subsequent status monitoring" },
    ],
  },
  {
    company: "DominiGames",
    logo: "dominigames",
    role: "QA Engineer",
    start: [2022, 3],
    end: [2023, 4],
    bullets: [
      { ru: "Ручное функциональное и нефункциональное тестирование на Android и iOS", en: "Manual functional and non-functional testing on Android and iOS" },
      { ru: "Внутреннее тестирование фич и альфа/бета-тестирование проектов", en: "Internal feature testing and alpha/beta project testing" },
      { ru: "Firebase Analytics, отчётность, тест-планы и тестовая документация", en: "Firebase Analytics, reporting, test plans and test documentation" },
      { ru: "Сборка проектов в Jenkins", en: "Project builds in Jenkins" },
      { ru: "Отслеживание жалоб пользователей через Helpdesk", en: "User-complaint tracking through Helpdesk" },
      { ru: "Обучение стажёров и замещение Team Lead", en: "Intern training and Team Lead replacement" },
    ],
  },
];

const skills: { number: string; title: Copy; description: Copy; tools: string[] }[] = [
  {
    number: "/01",
    title: { ru: "Требования и документация", en: "Requirements & documentation" },
    description: {
      ru: "Анализ требований, декомпозиция, тест-кейсы, чек-листы и тест-планы.",
      en: "Requirements analysis, decomposition, test cases, checklists and test plans.",
    },
    tools: ["TestRail", "Qase", "Confluence", "Coda", "Notion"],
  },
  {
    number: "/02",
    title: { ru: "Тестирование и релизы", en: "Testing & releases" },
    description: {
      ru: "Функциональное, нефункциональное, альфа/бета и регрессионное тестирование на Android, iOS и Huawei.",
      en: "Functional, non-functional, alpha/beta and regression testing on Android, iOS and Huawei.",
    },
    tools: ["Android Studio", "Xcode", "3uTools", "Jenkins", "TeamCity"],
  },
  {
    number: "/03",
    title: { ru: "Аналитика и наблюдаемость", en: "Analytics & observability" },
    description: {
      ru: "Проверка аналитических событий и сырых данных, работа с конфигурациями и анализ сбоев.",
      en: "Analytics-event and raw-data validation, configuration work and crash analysis.",
    },
    tools: ["Amplitude", "Swrve", "Adjust", "Firebase", "Sentry"],
  },
  {
    number: "/04",
    title: { ru: "Трафик и продуктовая работа", en: "Traffic & product work" },
    description: {
      ru: "Перехват и подмена запросов, проверка трафика, баг-репорты, контроль версий и пользовательские обращения.",
      en: "Request interception, traffic validation, bug reporting, version control and user requests.",
    },
    tools: ["Charles Proxy", "Postman", "Git", "Asana", "HelpShift"],
  },
];

const contacts = [
  { label: "Telegram", href: "https://t.me/shadow0king" },
  { label: "Email", href: "mailto:Im.gework@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/gevork-akopyan-066948247/" },
];

const tabIds: TabId[] = ["home", "experience", "skills", "about"];
const hashToTab: Record<string, TabId> = {
  home: "home",
  top: "home",
  experience: "experience",
  skills: "skills",
  about: "about",
  contact: "about",
};

const monthsBetween = (start: [number, number], end: [number, number]) => (end[0] - start[0]) * 12 + (end[1] - start[1]) + 1;

const formatDuration = (months: number, language: Language) => {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (language === "en") {
    return [years ? `${years} yr` : "", rest ? `${rest} mo` : ""].filter(Boolean).join(" ");
  }
  const yearWord = years === 1 ? "год" : years >= 2 && years <= 4 ? "года" : "лет";
  return [years ? `${years} ${yearWord}` : "", rest ? `${rest} мес.` : ""].filter(Boolean).join(" ");
};

const nowMonth = (): [number, number] => {
  const now = new Date();
  return [now.getFullYear(), now.getMonth() + 1];
};

const formatPeriod = (job: Job, language: Language) => {
  const end = job.end ? String(job.end[0]) : localize(copy.experience.present, language);
  const range = job.start[0] === job.end?.[0] ? String(job.start[0]) : `${job.start[0]} — ${end}`;
  return [range, formatDuration(monthsBetween(job.start, job.end ?? nowMonth()), language)];
};

function LanguageSwitcher({ language, onChange, variant }: { language: Language; onChange: (language: Language) => void; variant: "header" | "dock" }) {
  return (
    <div className="switcher" data-variant={variant} role="group" aria-label={localize(copy.langGroup, language)}>
      {(["en", "ru"] as Language[]).map((item) => (
        <button
          key={item}
          className="switcher-option"
          type="button"
          lang={item}
          aria-label={item === "en" ? "English" : "Русский"}
          aria-pressed={language === item}
          data-active={language === item || undefined}
          onClick={() => onChange(item)}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function ExperienceRow({ job, language }: { job: Job; language: Language }) {
  return (
    <article className="row">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="logo" src={asset(`/assets/img/logos/${job.logo}.png`)} alt="" aria-hidden="true" width={32} height={32} />
      <p className="row-company">{job.company}</p>
      <p className="row-role">{job.role}</p>
      <p className="row-period">
        {formatPeriod(job, language).map((part, index) => (
          <span key={part}>
            {index > 0 && <span className="row-period-dot"> · </span>}
            {part}
          </span>
        ))}
      </p>
    </article>
  );
}

function JobProjects({ job, language }: { job: Job; language: Language }) {
  const [railY, setRailY] = useState<number | null>(null);

  const moveRail = (event: MouseEvent<HTMLLIElement>) => {
    const item = event.currentTarget;
    setRailY(item.offsetTop + item.offsetHeight / 2);
  };

  if (!job.bullets.length) {
    return (
      <ul className="job-projects">
        <li className="job-empty">{localize(copy.experience.current, language)}</li>
      </ul>
    );
  }

  return (
    <>
      {job.summary && <p className="job-summary">{localize(job.summary, language)}</p>}
      <ul
        className="job-projects"
        data-rail-active={railY !== null || undefined}
        style={{ "--rail-y": `${railY ?? 0}px` } as CSSProperties}
        onMouseLeave={() => setRailY(null)}
      >
        {job.bullets.map((bullet) => (
          <li className="job-item" key={bullet.en} onMouseEnter={moveRail}>
            {localize(bullet, language)}
          </li>
        ))}
      </ul>
    </>
  );
}

const BOOT_MIN = 350;
const BOOT_MAX = 2500;
const BOOT_EXIT = 400;

function SiteBoot({ language }: { language: Language }) {
  const [fontsReady, setFontsReady] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [minElapsed, setMinElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [visible, setVisible] = useState(true);
  const [shown, setShown] = useState(0);
  const shownRef = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    document.documentElement.classList.add("is-loading");
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (!signal.aborted) setFontsReady(true);
    });
    const frame = window.requestAnimationFrame(() => {
      const images = Array.from(document.querySelectorAll<HTMLImageElement>(".page img")).filter((image) => {
        const box = image.getBoundingClientRect();
        return box.width > 0 && box.height > 0 && box.top < window.innerHeight;
      });
      if (!images.length) {
        setImagesLoaded(1);
        return;
      }
      let done = 0;
      images.forEach((image) => {
        const finish = () => {
          if (!signal.aborted) setImagesLoaded(++done / images.length);
        };
        if (image.complete) finish();
        else {
          image.addEventListener("load", finish, { once: true });
          image.addEventListener("error", finish, { once: true });
        }
      });
    });
    const minTimer = window.setTimeout(() => setMinElapsed(true), BOOT_MIN);
    const maxTimer = window.setTimeout(() => {
      setTimedOut(true);
      controller.abort();
    }, BOOT_MAX);
    return () => {
      controller.abort();
      window.cancelAnimationFrame(frame);
      window.clearTimeout(minTimer);
      window.clearTimeout(maxTimer);
      document.documentElement.classList.remove("is-loading");
    };
  }, []);

  const exiting = minElapsed && (timedOut || (fontsReady && imagesLoaded === 1));
  const progress = exiting ? 100 : Math.min(94, 10 + (fontsReady ? 30 : 0) + Math.round(54 * imagesLoaded));

  useEffect(() => {
    const from = shownRef.current;
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min((now - started) / 240, 1);
      const value = from + (progress - from) * (1 - (1 - t) ** 3);
      shownRef.current = value;
      setShown(value);
      if (t < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [progress]);

  useEffect(() => {
    if (!exiting) return;
    const timer = window.setTimeout(() => {
      setVisible(false);
      document.documentElement.classList.remove("is-loading");
    }, BOOT_EXIT);
    return () => window.clearTimeout(timer);
  }, [exiting]);

  if (!visible) return null;
  const value = Math.round(shown);
  return (
    <div className="boot" data-exiting={exiting || undefined} role="status" aria-live="polite" aria-label={`${localize(copy.boot, language)} ${value}%`}>
      <span className="boot-number" aria-hidden="true">{String(value).padStart(2, "0")}</span>
    </div>
  );
}

const THUMB_MIN = 36;
const THUMB_MAX = 72;
const THUMB_INSET = 10;

function ScrollThumb() {
  const [thumb, setThumb] = useState({ height: 0, top: 0, visible: false });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ y: 0, scroll: 0 });
  const frame = useRef<number | null>(null);

  const measure = useCallback(() => {
    const total = document.documentElement.scrollHeight;
    const view = window.innerHeight;
    const scrollable = total - view;
    if (scrollable <= 1) {
      setThumb((current) => (current.visible ? { ...current, visible: false } : current));
      return;
    }
    const track = view - THUMB_INSET * 2;
    const height = Math.min(THUMB_MAX, Math.max(THUMB_MIN, (view / total) * track));
    setThumb({ height, top: THUMB_INSET + (window.scrollY / scrollable) * (track - height), visible: true });
  }, []);

  useEffect(() => {
    const schedule = () => {
      frame.current ??= window.requestAnimationFrame(() => {
        frame.current = null;
        measure();
      });
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, [measure]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    dragStart.current = { y: event.clientY, scroll: window.scrollY };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const total = document.documentElement.scrollHeight;
    const view = window.innerHeight;
    const track = view - THUMB_INSET * 2 - thumb.height;
    if (track <= 0) return;
    const ratio = (total - view) / track;
    window.scrollTo({ top: dragStart.current.scroll + (event.clientY - dragStart.current.y) * ratio, behavior: "instant" });
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    setDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  if (!thumb.visible) return null;
  return (
    <div
      className="scroll-thumb"
      role="presentation"
      aria-hidden="true"
      data-dragging={dragging || undefined}
      style={{ height: thumb.height, transform: `translateY(${thumb.top}px)` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    />
  );
}

function ContactDock({ language, onLanguage, onAbout, onContact }: { language: Language; onLanguage: (language: Language) => void; onAbout: boolean; onContact: () => void }) {
  const messageRef = useRef<HTMLSpanElement>(null);
  const contactRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number>();

  useLayoutEffect(() => {
    const update = () => {
      const label = onAbout ? messageRef.current : contactRef.current;
      if (label) setWidth(label.offsetWidth + 44);
    };
    update();
    document.fonts?.ready.then(update).catch(() => {});
  }, [language, onAbout]);

  const labels = (
    <>
      <span ref={messageRef} className="cta-label" data-show={onAbout} aria-hidden={!onAbout}>
        {localize(copy.ctaMessage, language)}
      </span>
      <span ref={contactRef} className="cta-label" data-show={!onAbout} aria-hidden={onAbout}>
        {localize(copy.cta, language)}
      </span>
    </>
  );

  return (
    <div className="dock-wrap">
      <div className="dock">
        {onAbout ? (
          <a className="cta" href="https://t.me/shadow0king" target="_blank" rel="noreferrer" aria-label={localize(copy.ctaMessage, language)} style={{ width }}>
            {labels}
          </a>
        ) : (
          <button className="cta" type="button" aria-label={localize(copy.cta, language)} aria-controls="panel-about" onClick={onContact} style={{ width }}>
            {labels}
          </button>
        )}
        <div className="dock-language">
          <LanguageSwitcher language={language} onChange={onLanguage} variant="dock" />
        </div>
      </div>
    </div>
  );
}

const reveal = (index: number, className = "") => ({ className: `reveal ${className}`.trim(), style: { "--reveal-index": index } as CSSProperties });

export default function Home() {
  const [language, setLanguage] = useState<Language>("ru");
  const [tab, setTab] = useState<TabId>("home");
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ home: null, experience: null, skills: null, about: null });

  useEffect(() => {
    const saved = window.localStorage.getItem("portfolio-language");
    const syncHash = () => {
      const next = hashToTab[window.location.hash.replace("#", "")];
      if (next) setTab(next);
    };
    const frame = window.requestAnimationFrame(() => {
      if (saved === "ru" || saved === "en") setLanguage(saved);
      syncHash();
    });
    window.addEventListener("hashchange", syncHash);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", syncHash);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("portfolio-language", language);
  }, [language]);

  const selectTab = (next: TabId) => {
    if (next === tab) return;
    setDirection(tabIds.indexOf(next) > tabIds.indexOf(tab) ? "forward" : "backward");
    setTab(next);
    window.history.replaceState(null, "", next === "home" ? window.location.pathname : `#${next}`);
    window.scrollTo({ top: 0 });
  };

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = tabIds.indexOf(tab);
    const map: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabIds.length - 1 };
    if (!(event.key in map)) return;
    event.preventDefault();
    const next = tabIds[(map[event.key] + tabIds.length) % tabIds.length];
    selectTab(next);
    tabRefs.current[next]?.focus();
  };

  const cvHref = asset(language === "ru" ? "/assets/files/ru/CV_Gevork_Akopian.pdf" : "/assets/files/en/CV_Gevork_Akopian.pdf");

  return (
    <>
      <header className="header">
        <div className="header-language">
          <LanguageSwitcher language={language} onChange={setLanguage} variant="header" />
        </div>
        <nav className="nav" data-direction={direction} role="tablist" aria-label={localize(copy.tabsGroup, language)}>
          {tabIds.map((id) => (
            <button
              key={id}
              ref={(node) => {
                tabRefs.current[id] = node;
              }}
              id={`tab-${id}`}
              className="tab"
              type="button"
              role="tab"
              aria-controls={`panel-${id}`}
              aria-selected={tab === id}
              tabIndex={tab === id ? 0 : -1}
              data-active={tab === id || undefined}
              onClick={() => selectTab(id)}
              onKeyDown={onTabKey}
            >
              {localize(copy.tabs[id], language)}
            </button>
          ))}
        </nav>
      </header>

      <div id="top" className="page">
        {tab === "home" && (
          <main id="panel-home" className="home" role="tabpanel" aria-labelledby="tab-home">
            <section className="hero">
              <div className="hero-media">
                <Image className="hero-photo" src={asset("/assets/img/hero.jpg")} alt={localize(copy.name, language)} width={1600} height={1093} priority />
                <div className="hero-gradient" aria-hidden="true" />
              </div>
              <div className="intro">
                <div className="identity">
                  <p className="identity-name">{localize(copy.name, language)}</p>
                  <p>{localize(copy.location, language)}</p>
                </div>
                <div className="description">
                  <p>{localize(copy.hero.intro, language)}</p>
                  <p className="quote-line">
                    <span>{localize(copy.hero.quoteStart, language)}</span>
                    <span className="platforms" aria-hidden="true">
                      <span className="platform"><MousePointerClick strokeWidth={2.4} /></span>
                      <span className="platform"><Bug strokeWidth={2.4} /></span>
                    </span>
                    <span>{localize(copy.hero.quoteEnd, language)}</span>
                  </p>
                </div>
              </div>
            </section>

            <div className="product-activity">
              <a className="cv-card" href={cvHref} download="CV_Gevork_Akopian.pdf" aria-label={localize(copy.cv.aria, language)}>
                <span className="cv-card-face" aria-hidden="true"><span>QA_</span></span>
                <span className="cv-card-copy">
                  <span className="cv-card-heading">
                    <span className="cv-card-title">{localize(copy.cv.title, language)}</span>
                    <span className="cv-card-version">{localize(copy.cv.version, language)}</span>
                  </span>
                  <span className="cv-card-description">{localize(copy.cv.description, language)}</span>
                </span>
                <span className="cv-card-open" aria-hidden="true"><ArrowDown size={18} strokeWidth={2} /></span>
              </a>
              <a className="cv-card" href={asset("/products/")}>
                <span className="cv-card-face" aria-hidden="true"><span>APP</span></span>
                <span className="cv-card-copy">
                  <span className="cv-card-heading">
                    <span className="cv-card-title">{localize(copy.products.title, language)}</span>
                  </span>
                  <span className="cv-card-description">{localize(copy.products.description, language)}</span>
                </span>
                <span className="cv-card-open" aria-hidden="true"><ArrowRight size={18} strokeWidth={2} /></span>
              </a>
            </div>

            <section className="experience">
              <p className="label">{localize(copy.experience.label, language)}</p>
              <span className="accent" />
              <div className="experience-list">
                {jobs.map((job) => <ExperienceRow key={job.company} job={job} language={language} />)}
              </div>
            </section>
          </main>
        )}

        {tab === "experience" && (
          <main id="panel-experience" className="panel" role="tabpanel" aria-labelledby="tab-experience">
            <div className="group">
              <div {...reveal(0, "panel-intro")}>
                <p className="label">{localize(copy.experience.label, language)}</p>
                <span className="accent" />
                <p>{localize(copy.experience.intro, language)}</p>
              </div>
              <div className="job-list">
                {jobs.map((job, index) => (
                  <section className="job" key={job.company}>
                    <div {...reveal(index * 2 + 1)}>
                      <ExperienceRow job={job} language={language} />
                    </div>
                    <div {...reveal(index * 2 + 2)}>
                      <JobProjects job={job} language={language} />
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </main>
        )}

        {tab === "skills" && (
          <main id="panel-skills" className="panel" role="tabpanel" aria-labelledby="tab-skills">
            <div className="group">
              <div {...reveal(0, "panel-intro")}>
                <p className="label">{localize(copy.skills.label, language)}</p>
                <span className="accent" />
                <p>{localize(copy.skills.intro, language)}</p>
              </div>
              <div className="skills-grid">
                {skills.map((skill, index) => (
                  <article className="skill reveal" key={skill.number} style={{ "--reveal-index": index + 1 } as CSSProperties}>
                    <span className="skill-number">{skill.number}</span>
                    <h3>{localize(skill.title, language)}</h3>
                    <p>{localize(skill.description, language)}</p>
                    <div className="chips">
                      {skill.tools.map((tool) => <span className="chip" key={tool}>{tool}</span>)}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </main>
        )}

        {tab === "about" && (
          <main id="panel-about" className="panel" role="tabpanel" aria-labelledby="tab-about">
            <div className="group about">
              <div {...reveal(0, "about-hero")}>
                <div className="hero-media">
                  <Image className="hero-photo" src={asset("/assets/img/hero.jpg")} alt={localize(copy.name, language)} width={1600} height={1093} />
                  <div className="hero-gradient" aria-hidden="true" />
                </div>
              </div>
              <div {...reveal(1, "connect")}>
                <p className="label">{localize(copy.about.connect, language)}</p>
                <ul className="connect-list">
                  {contacts.map((item) => (
                    <li key={item.label}>
                      <a className="connect-link" href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                        {item.label}
                      </a>
                    </li>
                  ))}
                  <li><a className="connect-link" href={asset("/assets/files/ru/CV_Gevork_Akopian.pdf")} download="CV_Gevork_Akopian.pdf">{localize(copy.about.cvRu, language)}</a></li>
                  <li><a className="connect-link" href={asset("/assets/files/en/CV_Gevork_Akopian.pdf")} download="CV_Gevork_Akopian.pdf">{localize(copy.about.cvEn, language)}</a></li>
                </ul>
              </div>
              <div {...reveal(2, "about-copy")}>
                {copy.about.paragraphs.map((paragraph) => <p key={paragraph.en}>{localize(paragraph, language)}</p>)}
                <p className="muted">{localize(copy.about.quote, language)}</p>
              </div>
            </div>
          </main>
        )}
      </div>

      <ContactDock language={language} onLanguage={setLanguage} onAbout={tab === "about"} onContact={() => selectTab("about")} />
      <ScrollThumb />
      <SiteBoot language={language} />
    </>
  );
}
