import { en, type TranslationDict } from './en';
import { hi } from './hi';
import { pa } from './pa';
import { haryanvi } from './haryanvi';
import { mr } from './mr';
import { gu } from './gu';

export type { TranslationDict };

export type Language = 'en' | 'hi' | 'pa' | 'haryanvi' | 'mr' | 'gu';

export interface LanguageMeta {
  code: Language;
  label: string;
  nativeLabel: string;
}

export const LANGUAGES: LanguageMeta[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ' },
  { code: 'haryanvi', label: 'Haryanvi', nativeLabel: 'हरियाणवी' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
];

export const translations: Record<Language, TranslationDict> = {
  en,
  hi,
  pa,
  haryanvi,
  mr,
  gu,
};

export type TranslationKey = keyof TranslationDict;

export function getLanguageMeta(code: Language): LanguageMeta {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}
