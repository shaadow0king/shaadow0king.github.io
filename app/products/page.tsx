"use client";

import { ArrowDown, ArrowLeft, ArrowUpRight, Laptop, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

type Language = "ru" | "en";
type Copy = { ru: string; en: string };

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Product = {
  name: string;
  icon: string; // under public/, shown at 44 px
  device: "mac" | "iphone";
  platform: Copy;
  description: Copy;
  download: string; // direct download, or the store page
  repo?: string; // GitHub owner/name; downloads are summed over all its releases
  store?: string; // store name shown instead of the download count
};

// Add a product here; the page lists them in this order.
const products: Product[] = [
  {
    name: "Mistype",
    icon: "/assets/img/products/mistype.png",
    device: "mac",
    platform: { ru: "macOS 15+", en: "macOS 15+" },
    description: {
      ru: "Исправляет текст, набранный не в той раскладке: ghbdtn → привет. Бесплатно, без подписки.",
      en: "Fixes text typed in the wrong keyboard layout: ghbdtn → привет. Free, no subscription.",
    },
    download: "https://github.com/shaadow0king/keyboard-switcher/releases/latest/download/Mistype.dmg",
    repo: "shaadow0king/keyboard-switcher",
  },
  {
    name: "PinSay",
    icon: "/assets/img/products/pinsay.png",
    device: "iphone",
    platform: { ru: "iOS 17+", en: "iOS 17+" },
    description: {
      ru: "Карта любимых мест: отмечайте кафе, виды и тихие уголки, добавляйте фото и делитесь ими.",
      en: "A map of your favorite places: pin cafés, views and quiet spots, add photos and share them.",
    },
    download: "https://apps.apple.com/app/pinsay/id6813660305",
    store: "App Store",
  },
];

function downloadsLabel(count: number, language: Language) {
  if (language === "en") return `${count} ${count === 1 ? "download" : "downloads"}`;
  const n10 = count % 10;
  const n100 = count % 100;
  const word = n10 === 1 && n100 !== 11 ? "скачивание" : n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14) ? "скачивания" : "скачиваний";
  return `${count} ${word}`;
}

// Download counts come from the GitHub releases API (public, no token), cached for the browser session.
async function fetchDownloads(repo: string) {
  const key = `downloads:${repo}`;
  const cached = window.sessionStorage.getItem(key);
  if (cached) return Number(cached);
  const response = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=100`);
  if (!response.ok) return null;
  const releases: { assets: { download_count: number }[] }[] = await response.json();
  const total = releases.reduce((sum, release) => sum + release.assets.reduce((s, asset) => s + asset.download_count, 0), 0);
  window.sessionStorage.setItem(key, String(total));
  return total;
}

const copy = {
  back: { ru: "Резюме", en: "Resume" },
  title: { ru: "Продукты", en: "Products" },
  intro: { ru: "Которые я создаю с помощью AI.", en: "That I build with AI." },
  download: { ru: "Скачать", en: "Download" },
  open: { ru: "Открыть", en: "Open" },
  macOnly: { ru: "Только для Mac", en: "Mac only" },
  iphoneOnly: { ru: "Для iPhone", en: "For iPhone" },
  downloads: { ru: "Скачиваний", en: "Downloads" },
  comingSoon: { ru: "Скоро здесь появятся новые приложения.", en: "New apps coming soon." },
  langGroup: { ru: "Выбор языка", en: "Language selector" },
};

export default function Products() {
  const [language, setLanguage] = useState<Language>("ru");
  const t = (value: Copy) => value[language];
  const [downloads, setDownloads] = useState<Record<string, number>>({});

  useEffect(() => {
    for (const { repo } of products) {
      if (!repo) continue;
      fetchDownloads(repo)
        .then((count) => {
          if (count !== null) setDownloads((current) => ({ ...current, [repo]: count }));
        })
        .catch(() => {});
    }
  }, []);

  // Same language choice as the home page.
  useEffect(() => {
    const saved = window.localStorage.getItem("portfolio-language");
    const frame = window.requestAnimationFrame(() => {
      if (saved === "ru" || saved === "en") setLanguage(saved);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("portfolio-language", language);
  }, [language]);

  return (
    <>
      <header className="header">
        {/* The home page moves its switcher to the bottom dock on narrow screens; this page has no dock, so it stays. */}
        <div className="header-language products-language">
          <div className="switcher" data-variant="header" role="group" aria-label={t(copy.langGroup)}>
            {(["en", "ru"] as Language[]).map((item) => (
              <button
                key={item}
                className="switcher-option"
                type="button"
                lang={item}
                aria-label={item === "en" ? "English" : "Русский"}
                aria-pressed={language === item}
                data-active={language === item || undefined}
                onClick={() => setLanguage(item)}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <nav className="nav">
          <a className="tab products-back" href={`${basePath}/`}>
            <ArrowLeft size={14} strokeWidth={2.2} aria-hidden="true" />
            {t(copy.back)}
          </a>
        </nav>
      </header>

      <div className="page">
        <main className="panel">
          <div className="group">
            <div className="panel-intro">
              <h1 className="label products-title">{t(copy.title)}</h1>
              <p>{t(copy.intro)}</p>
            </div>
            <ul className="products-list">
              {products.map((product) => {
                const deviceLabel = t(product.device === "mac" ? copy.macOnly : copy.iphoneOnly);
                const DeviceIcon = product.device === "mac" ? Laptop : Smartphone;
                const OpenIcon = product.store ? ArrowUpRight : ArrowDown;
                const count = product.repo ? downloads[product.repo] : undefined;
                return (
                <li key={product.name}>
                  <a
                    className="cv-card"
                    href={product.download}
                    aria-label={`${t(product.store ? copy.open : copy.download)} ${product.name}${product.store ? ` (${product.store})` : ""}`}
                    {...(product.store ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- static export, a 44 px icon */}
                    <img className="products-icon" src={`${basePath}${product.icon}`} alt="" width={44} height={44} />
                    <span className="cv-card-copy">
                      <span className="cv-card-heading">
                        <span className="cv-card-title">{product.name}</span>
                        <span className="cv-card-version products-platform" title={deviceLabel}>
                          <DeviceIcon size={13} strokeWidth={2} aria-label={deviceLabel} />
                          {t(product.platform)}
                        </span>
                        {product.store && <span className="cv-card-version products-downloads">{product.store}</span>}
                        {count !== undefined && (
                          <span className="cv-card-version products-downloads" title={t(copy.downloads)}>
                            <ArrowDown size={13} strokeWidth={2} aria-hidden="true" />
                            {downloadsLabel(count, language)}
                          </span>
                        )}
                      </span>
                      <span className="cv-card-description">{t(product.description)}</span>
                    </span>
                    <span className="cv-card-open" aria-hidden="true"><OpenIcon size={18} strokeWidth={2} /></span>
                  </a>
                </li>
                );
              })}
              <li className="products-soon">{t(copy.comingSoon)}</li>
            </ul>
          </div>
        </main>
      </div>
    </>
  );
}
