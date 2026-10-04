import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { LANGUAGES } from '@/translations';

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label={current.label}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="inline-flex items-center gap-1.5 bg-earth-100 rounded-full px-3 py-1.5 border border-earth-200 text-sm font-semibold text-forest-800 hover:bg-earth-200 transition"
      >
        <Globe className="w-4 h-4 text-forest-700" />
        <span className="hidden sm:inline">{current.nativeLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div role="listbox" aria-label="Language" className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-earth-200 py-1 z-50 max-h-80 overflow-y-auto">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              role="option"
              aria-selected={lang === l.code}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm transition ${
                lang === l.code
                  ? 'bg-forest-50 text-forest-800 font-bold'
                  : 'text-earth-600 hover:bg-cream-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-base">{l.nativeLabel}</span>
                <span className="text-xs text-earth-400">{l.label}</span>
              </span>
              {lang === l.code && <Check className="w-4 h-4 text-forest-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
