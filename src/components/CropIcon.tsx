import { CROPS, type CropInfo } from '@/data/mockData';
import type { Language } from '@/translations';

export function getCropName(cropEn: string, lang: Language): string {
  const crop = CROPS.find((c) => c.name.en === cropEn);
  if (crop) return crop.name[lang];
  return cropEn;
}

export function getCropEmoji(cropEn: string): string {
  const crop = CROPS.find((c) => c.name.en === cropEn);
  return crop?.emoji ?? '🌾';
}

export function CropBadge({ crop, lang }: { crop: string; lang: Language }) {
  const emoji = getCropEmoji(crop);
  const name = getCropName(crop, lang);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-base">{emoji}</span>
      <span>{name}</span>
    </span>
  );
}

export { type CropInfo };
