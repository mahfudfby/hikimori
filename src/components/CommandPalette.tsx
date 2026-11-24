// src/components/CommandPalette.tsx — Pencarian cepat & navigasi global instan (Ctrl + K / Cmd + K).
// Menyediakan akses langsung ke halaman, artikel portofolio, riwayat kerja, dan aksi sistem.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Icon } from './ui';
import { useContent } from '../content/ContentContext';
import { usePortfolio } from '../hooks/usePortfolio';
import { useLang } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { pick, waLink } from '../content/derive';
import { mailLink } from '../utils/mailLink';
import { NAV } from './Layout';

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface PaletteItem {
  id: string;
  category: 'page' | 'portfolio' | 'action' | 'exp';
  categoryLabel: string;
  title: string;
  subtitle?: string;
  icon: string;
  perform: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { content } = useContent();
  const { items: portfolioItems } = usePortfolio();
  const { lang, toggle: toggleLang, t } = useLang();
  const { mode, toggle: toggleTheme } = useTheme();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Reset query dan fokus saat palette dibuka
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      const timer = setTimeout(() => inputRef.current?.focus(), 40);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Keyboard shortcut listener untuk ESC & panah
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const p = content.profile;

  // Bangun daftar semua item yang dapat dicari
  const allItems: PaletteItem[] = useMemo(() => {
    const list: PaletteItem[] = [];

    // 1. Navigasi Halaman Utama
    NAV.forEach(nav => {
      list.push({
        id: `page-${nav.to}`,
        category: 'page',
        categoryLabel: t('Halaman', 'Pages'),
        title: lang === 'en' ? nav.en : nav.id,
        subtitle: `hikimori.web.id${nav.to}`,
        icon: nav.to === '/' ? 'home'
          : nav.to === '/profil' ? 'user'
          : nav.to === '/pengalaman' ? 'briefcase'
          : nav.to === '/pendidikan' ? 'cap'
          : nav.to === '/sertifikat' ? 'award'
          : nav.to === '/keahlian' ? 'tool'
          : nav.to === '/layanan' ? 'layers'
          : nav.to === '/portofolio' ? 'image'
          : 'chat',
        perform: () => navigate(nav.to),
      });
    });

    // 2. Proyek Portofolio
    portfolioItems.forEach(item => {
      const targetSlug = item.slug || item.id;
      list.push({
        id: `folio-${item.id}`,
        category: 'portfolio',
        categoryLabel: t('Karya Portofolio', 'Portfolio Work'),
        title: item.title,
        subtitle: [item.category, item.year, item.client, targetSlug ? `/${targetSlug}` : ''].filter(Boolean).join(' · '),
        icon: 'image',
        perform: () => navigate(`/portofolio/${targetSlug}`),
      });
    });

    // 3. Riwayat Kerja
    (content.exp || []).forEach(exp => {
      list.push({
        id: `exp-${exp.id}`,
        category: 'exp',
        categoryLabel: t('Pengalaman Kerja', 'Work Experience'),
        title: pick(exp.position, lang) || exp.company,
        subtitle: `${exp.company} (${exp.start || ''} — ${exp.end || t('Sekarang', 'Present')})`,
        icon: 'briefcase',
        perform: () => navigate('/pengalaman'),
      });
    });

    // 4. Aksi Cepat
    list.push({
      id: 'action-theme',
      category: 'action',
      categoryLabel: t('Aksi Cepat', 'Quick Actions'),
      title: mode === 'dark' ? t('Beralih ke Mode Terang', 'Switch to Light Mode') : t('Beralih ke Mode Gelap', 'Switch to Dark Mode'),
      subtitle: t('Ubah tampilan tema situs', 'Toggle website color theme'),
      icon: mode === 'dark' ? 'sun' : 'moon',
      perform: () => toggleTheme(),
    });

    list.push({
      id: 'action-lang',
      category: 'action',
      categoryLabel: t('Aksi Cepat', 'Quick Actions'),
      title: lang === 'en' ? 'Ganti ke Bahasa Indonesia' : 'Switch to English',
      subtitle: t('Ubah bahasa antarmuka', 'Change display language'),
      icon: 'globe',
      perform: () => toggleLang(),
    });

    list.push({
      id: 'action-cv',
      category: 'action',
      categoryLabel: t('Aksi Cepat', 'Quick Actions'),
      title: t('Unduh / Lihat Dokumen CV', 'Download / View CV Document'),
      subtitle: t('Buka lembar kurikulum vitae lengkap', 'Open full curriculum vitae'),
      icon: 'download',
      perform: () => navigate('/cv'),
    });

    if (p.whatsapp) {
      list.push({
        id: 'action-wa',
        category: 'action',
        categoryLabel: t('Aksi Cepat', 'Quick Actions'),
        title: t('Kirim Pesan WhatsApp', 'Send WhatsApp Message'),
        subtitle: p.whatsapp,
        icon: 'whatsapp',
        perform: () => window.open(waLink(content, lang), '_blank', 'noopener,noreferrer'),
      });
    }

    if (p.email) {
      list.push({
        id: 'action-mail',
        category: 'action',
        categoryLabel: t('Aksi Cepat', 'Quick Actions'),
        title: t('Kirim Email', 'Send Email'),
        subtitle: p.email,
        icon: 'mail',
        perform: () => { window.location.href = mailLink(p.email); },
      });
    }

    return list;
  }, [content, portfolioItems, lang, mode, navigate, t, toggleLang, toggleTheme, p]);

  // Filter berdasarkan query pencarian
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSubtitle = (item.subtitle || '').toLowerCase().includes(q);
      const matchCat = item.categoryLabel.toLowerCase().includes(q);
      return matchTitle || matchSubtitle || matchCat;
    });
  }, [allItems, query]);

  // Reset activeIndex saat hasil filter berubah
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Navigasi keyboard atas/bawah & Enter di form input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!filtered.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => (i + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = filtered[activeIndex];
      if (current) {
        current.perform();
        onClose();
      }
    }
  };

  // Scroll item aktif ke dalam viewport
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector('.cmd-item.active') as HTMLElement;
    if (activeEl?.scrollIntoView) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  if (!open) return null;

  return createPortal(
    <div className="cmd-backdrop modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="cmd-modal card solid" onClick={e => e.stopPropagation()}>
        <div className="cmd-header row gap-12" style={{ alignItems: 'center' }}>
          <Icon name="search" size={20} className="cmd-search-ico" />
          <input
            ref={inputRef}
            className="cmd-input"
            type="text"
            placeholder={t('Ketik perintah, nama halaman, atau proyek…', 'Type a command, page name, or project…')}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button type="button" className="icon-btn xs" onClick={() => setQuery('')} aria-label="Hapus">
              <Icon name="close" size={14} />
            </button>
          )}
          <kbd className="cmd-esc-badge" onClick={onClose}>ESC</kbd>
        </div>

        <div className="cmd-list" ref={listRef}>
          {filtered.length === 0 ? (
            <div className="empty" style={{ padding: '32px 16px' }}>
              <p className="small muted">{t('Tidak ada hasil untuk', 'No results for')} "{query}"</p>
              <p className="xs faint mt-4">{t('Coba cari dengan kata kunci lain seperti "portofolio", "kontak", atau "HR".', 'Try other keywords like "portfolio", "contact", or "HR".')}</p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isActive = idx === activeIndex;
              const prev = filtered[idx - 1];
              const showCategory = !prev || prev.category !== item.category;

              return (
                <React.Fragment key={item.id}>
                  {showCategory && (
                    <div className="cmd-category-label xs muted">
                      {item.categoryLabel}
                    </div>
                  )}
                  <div
                    className={`cmd-item row gap-12${isActive ? ' active' : ''}`}
                    onClick={() => {
                      item.perform();
                      onClose();
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                  >
                    <div className="cmd-item-icon">
                      <Icon name={item.icon} size={16} />
                    </div>
                    <div className="grow" style={{ minWidth: 0 }}>
                      <div className="cmd-item-title small">{item.title}</div>
                      {item.subtitle && <div className="cmd-item-sub xs muted">{item.subtitle}</div>}
                    </div>
                    <Icon name="arrow" size={14} className="cmd-item-arrow" />
                  </div>
                </React.Fragment>
              );
            })
          )}
        </div>

        <footer className="cmd-footer row between wrap gap-8">
          <div className="row gap-12 xs muted" style={{ alignItems: 'center' }}>
            <span><kbd>↑</kbd> <kbd>↓</kbd> {t('pilih', 'navigate')}</span>
            <span><kbd>↵</kbd> {t('buka', 'select')}</span>
            <span><kbd>esc</kbd> {t('tutup', 'close')}</span>
          </div>
          <div className="xs faint">Hikimori System</div>
        </footer>
      </div>
    </div>,
    document.body
  );
};

export default CommandPalette;
