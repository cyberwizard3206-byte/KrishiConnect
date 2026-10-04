import { useState, useEffect } from 'react';
import { User, Phone, MapPin, Wheat, Calendar, Building2, Edit2, CheckCircle, AlertCircle, Loader2, Save, X } from 'lucide-react';
import { useLanguage, type TranslationKey } from '@/context/LanguageContext';
import { Card, StatusBadge } from '@/components/ui';
import { Logo } from '@/components/Logo';
import { CROPS } from '@/data/mockData';
import {
  supabase,
  type Farmer,
  type ProcurementCentre,
  fetchCentres,
  updateFarmerProfile,
} from '@/lib/supabase';
import type { Page } from '@/App';
import type { Language } from '@/translations';

const STATUS_KEYS: Record<string, TranslationKey> = {
  registered: 'statusRegistered',
  verified: 'statusVerified',
  slot_booked: 'statusSlotBooked',
  arrived: 'statusArrived',
  procured: 'statusProcured',
  payment_sent: 'statusPaymentSent',
  payment_received: 'statusPaymentReceived',
};

export function ProfilePage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { t, lang } = useLanguage();
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [centres, setCentres] = useState<ProcurementCentre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', village: '', district: '', state: '', crop: '', procurement_centre_id: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error: dbError } = await supabase
        .from('farmers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (dbError) {
        setError(true);
      } else if (data) {
        setFarmer(data as Farmer);
        setEditForm({
          name: (data as Farmer).name ?? '',
          village: (data as Farmer).village ?? '',
          district: (data as Farmer).district ?? '',
          state: (data as Farmer).state ?? '',
          crop: (data as Farmer).crop ?? '',
          procurement_centre_id: (data as Farmer).procurement_centre_id ?? '',
        });
      }
      try {
        const c = await fetchCentres();
        setCentres(c);
      } catch {
        // centres optional
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    if (!farmer) return;
    setSaving(true);
    setMessage(null);
    try {
      await updateFarmerProfile(farmer.id, {
        name: editForm.name,
        village: editForm.village || null,
        district: editForm.district || null,
        state: editForm.state || null,
        crop: editForm.crop || null,
        procurement_centre_id: editForm.procurement_centre_id || null,
      });
      const updated = { ...farmer, ...editForm };
      setFarmer(updated);
      setEditing(false);
      setMessage({ type: 'success', text: t('profileUpdated') });
    } catch {
      setMessage({ type: 'error', text: t('profileUpdateFailed') });
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-12 flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 animate-spin text-forest-600 mr-3" />
        <span className="text-earth-500 font-medium">{t('loading')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-12">
        <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-100 flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {t('saveError')}
        </div>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-12">
        <div className="text-center py-16 text-earth-400">
          <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="mb-4">{t('noFarmers')}</p>
          <button onClick={() => onNavigate('register')} className="btn-primary">
            {t('registerAsFarmer')}
          </button>
        </div>
      </div>
    );
  }

  const centre = centres.find((c) => c.id === farmer.procurement_centre_id);
  const date = new Date(farmer.created_at).toLocaleDateString('en-CA');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-12 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-5 h-5 text-forest-700" />
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
            {t('profileTitle')}
          </h1>
        </div>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm font-medium ${
            message.type === 'success'
              ? 'bg-leaf-50 text-leaf-700 border border-leaf-100'
              : 'bg-red-50 text-red-700 border border-red-100'
          }`}
        >
          {message.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          {message.text}
        </div>
      )}

      <Card className="p-5 sm:p-6">
        {!editing ? (
          <>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Logo size={56} className="shrink-0" />
                <div className="w-14 h-14 rounded-2xl bg-forest-100 flex items-center justify-center">
                  <User className="w-7 h-7 text-forest-700" />
                </div>
                <div>
                  <div className="font-display text-xl font-bold text-forest-900">{farmer.name}</div>
                  <div className="text-sm text-earth-500">{farmer.mobile}</div>
                </div>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-forest-700 bg-forest-50 hover:bg-forest-100 transition border border-forest-100"
              >
                <Edit2 className="w-4 h-4" />
                <span className="hidden sm:inline">{t('editProfile')}</span>
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <ProfileField icon={User} label={t('farmerName')} value={farmer.name} />
              <ProfileField icon={Phone} label={t('mobileNumber')} value={farmer.mobile} />
              <ProfileField icon={MapPin} label={t('village')} value={farmer.village ?? '-'} />
              <ProfileField icon={MapPin} label={t('district')} value={farmer.district ?? '-'} />
              <ProfileField icon={MapPin} label={t('state')} value={farmer.state ?? '-'} />
              <ProfileField icon={Wheat} label={t('crop')} value={farmer.crop ?? '-'} />
              <ProfileField icon={Building2} label={t('procurementCentre')} value={centre?.name ?? t('noCentreSelected')} />
              <ProfileField icon={Calendar} label={t('registeredOn')} value={date} />
            </div>

            <div className="mt-5 pt-5 border-t border-earth-100">
              <div className="text-xs text-earth-500 mb-2 font-semibold">{t('currentStatus')}</div>
              <StatusBadge variant="active" label={t(STATUS_KEYS[farmer.status] ?? 'statusRegistered')} pulse />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-forest-900">{t('editProfile')}</h2>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-earth-500 bg-earth-50 hover:bg-earth-100 transition"
              >
                <X className="w-4 h-4" />
                {t('cancelEdit')}
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <EditField label={t('farmerName')}>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="input" />
              </EditField>
              <EditField label={t('village')}>
                <input type="text" value={editForm.village} onChange={(e) => setEditForm({ ...editForm, village: e.target.value })} className="input" />
              </EditField>
              <EditField label={t('district')}>
                <input type="text" value={editForm.district} onChange={(e) => setEditForm({ ...editForm, district: e.target.value })} className="input" />
              </EditField>
              <EditField label={t('state')}>
                <input type="text" value={editForm.state} onChange={(e) => setEditForm({ ...editForm, state: e.target.value })} className="input" />
              </EditField>
              <EditField label={t('crop')}>
                <select value={editForm.crop} onChange={(e) => setEditForm({ ...editForm, crop: e.target.value })} className="input cursor-pointer">
                  <option value="">{t('selectCrop')}</option>
                  {CROPS.map((c) => (
                    <option key={c.id} value={c.name.en}>
                      {c.name[lang as Language] ?? c.name.en}
                    </option>
                  ))}
                </select>
              </EditField>
              <EditField label={t('procurementCentre')}>
                <select value={editForm.procurement_centre_id} onChange={(e) => setEditForm({ ...editForm, procurement_centre_id: e.target.value })} className="input cursor-pointer">
                  <option value="">{t('selectCentre')}</option>
                  {centres.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </EditField>
            </div>

            <button onClick={handleSave} disabled={saving} className="btn-primary mt-5 disabled:opacity-50">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {t('saveProfile')}
            </button>
          </>
        )}
      </Card>
    </div>
  );
}

function ProfileField({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-forest-700" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-earth-500 font-medium">{label}</div>
        <div className="font-semibold text-forest-900 truncate">{value}</div>
      </div>
    </div>
  );
}

function EditField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-earth-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
