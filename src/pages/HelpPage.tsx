import { useState, useEffect } from 'react';
import { HelpCircle, Phone, MessageSquare, MapPin, User } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui';
import { supabase, type Farmer, type ProcurementCentre, fetchCentres } from '@/lib/supabase';

export function HelpPage() {
  const { t } = useLanguage();
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [centres, setCentres] = useState<ProcurementCentre[]>([]);
  const [loading, setLoading] = useState(true);
  const [smsText, setSmsText] = useState(t('smsMessage'));

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('farmers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) setFarmer(data as Farmer);
      try {
        const c = await fetchCentres();
        setCentres(c);
      } catch {
        // optional
      }
      setLoading(false);
    }
    load();
  }, []);

  const centre = centres.find((c) => c.id === farmer?.procurement_centre_id);
  const adminContact = centre?.admin_contact ?? '9876543210';

  function handleCall() {
    window.location.href = `tel:${adminContact}`;
  }

  function handleSms() {
    window.location.href = `sms:${adminContact}?body=${encodeURIComponent(smsText)}`;
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-12 flex items-center justify-center min-h-[40vh]">
        <span className="text-earth-500 font-medium">{t('loading')}</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-12 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle className="w-5 h-5 text-forest-700" />
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
            {t('helpTitle')}
          </h1>
        </div>
        <p className="text-earth-500 text-sm">{t('helpSubtitle')}</p>
      </div>

      <p className="text-sm text-earth-500 mb-5">{t('helpNote')}</p>

      {/* Centre info */}
      <Card className="p-4 mb-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-forest-700" />
          </div>
          <div>
            <div className="text-xs text-earth-500 font-medium">{t('yourCentre')}</div>
            <div className="font-bold text-forest-900">{centre?.name ?? t('noCentreSelected')}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-saffron-50 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-saffron-600" />
          </div>
          <div>
            <div className="text-xs text-earth-500 font-medium">{t('adminContact')}</div>
            <div className="font-bold text-forest-900">{adminContact}</div>
          </div>
        </div>
      </Card>

      {/* Call button */}
      <button
        onClick={handleCall}
        className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-forest-700 text-white font-bold text-base hover:bg-forest-800 transition mb-3"
      >
        <Phone className="w-5 h-5" />
        {t('callAdmin')}
      </button>

      {/* SMS section */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-5 h-5 text-forest-700" />
          <span className="font-bold text-forest-900">{t('sendSms')}</span>
        </div>
        <textarea
          value={smsText}
          onChange={(e) => setSmsText(e.target.value)}
          rows={3}
          className="input resize-none mb-3"
        />
        <button
          onClick={handleSms}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-saffron-500 text-white font-bold hover:bg-saffron-600 transition"
        >
          <MessageSquare className="w-5 h-5" />
          {t('sendSms')}
        </button>
      </Card>
    </div>
  );
}
