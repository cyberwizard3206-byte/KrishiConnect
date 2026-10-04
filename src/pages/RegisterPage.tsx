import { useState, useEffect, useCallback } from 'react';
import { UserPlus, Search, Phone, MapPin, Wheat, CheckCircle, AlertCircle, Loader2, ChevronDown, ChevronUp, Building2 } from 'lucide-react';
import { useLanguage, type TranslationKey } from '@/context/LanguageContext';
import { Card, StatusBadge } from '@/components/ui';
import { CROPS } from '@/data/mockData';
import {
  supabase,
  type Farmer,
  type ProcurementCentre,
  PROCUREMENT_STAGES,
  fetchCentres,
  updateFarmerCentre,
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

export function RegisterPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { t, lang } = useLanguage();
  const [form, setForm] = useState({ name: '', mobile: '', village: '', district: '', state: '', crop: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchMobile, setSearchMobile] = useState('');
  const [searching, setSearching] = useState(false);
  const [foundFarmer, setFoundFarmer] = useState<Farmer | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [allFarmers, setAllFarmers] = useState<Farmer[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [expandedFarmer, setExpandedFarmer] = useState<string | null>(null);

  // Centre selection state
  const [centres, setCentres] = useState<ProcurementCentre[]>([]);
  const [showCentrePicker, setShowCentrePicker] = useState(false);
  const [registeredFarmer, setRegisteredFarmer] = useState<Farmer | null>(null);
  const [centreSearch, setCentreSearch] = useState('');
  const [savingCentre, setSavingCentre] = useState(false);

  const loadFarmers = useCallback(async () => {
    setLoadingList(true);
    setListError(null);
    try {
      const { data, error } = await supabase
        .from('farmers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAllFarmers((data as Farmer[]) ?? []);
    } catch (error) {
      console.error('Unable to load registered farmers:', error);
      setListError(t('saveError'));
    } finally {
      setLoadingList(false);
    }
  }, [t]);

  const loadCentres = useCallback(async () => {
    try {
      const c = await fetchCentres();
      setCentres(c);
    } catch (error) {
      console.error('Unable to load procurement centres:', error);
    }
  }, []);

  useEffect(() => {
    void loadFarmers();
    void loadCentres();
  }, [loadFarmers, loadCentres]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.mobile) return;
    setSaving(true);
    setMessage(null);

    const tokenNum = String(Math.floor(Math.random() * 900) + 100);

    const { data, error } = await supabase
      .from('farmers')
      .upsert(
        {
          name: form.name,
          mobile: form.mobile,
          village: form.village || null,
          district: form.district || null,
          state: form.state || null,
          crop: form.crop || null,
          token: tokenNum,
          status: 'registered',
        },
        { onConflict: 'mobile' }
      )
      .select()
      .maybeSingle();

    if (error) {
      setMessage({ type: 'error', text: t('registrationFailed') });
    } else if (data) {
      setMessage({ type: 'success', text: t('farmerRegistered') });
      setForm({ name: '', mobile: '', village: '', district: '', state: '', crop: '' });
      setRegisteredFarmer(data as Farmer);
      setShowCentrePicker(true);
      await loadFarmers();
    }
    setSaving(false);
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchMobile) return;
    setSearching(true);
    setSearchError(null);
    setFoundFarmer(null);

    const { data, error } = await supabase
      .from('farmers')
      .select('*')
      .eq('mobile', searchMobile)
      .maybeSingle();

    if (error) {
      setSearchError(t('saveError'));
    } else if (data) {
      setFoundFarmer(data as Farmer);
    } else {
      setSearchError(t('farmerNotFound'));
    }
    setSearching(false);
  }

  async function updateStatus(farmerId: string, newStatus: string) {
    setUpdatingStatus(true);
    const { error } = await supabase
      .from('farmers')
      .update({ status: newStatus })
      .eq('id', farmerId);

    if (error) {
      setMessage({ type: 'error', text: t('statusUpdateFailed') });
    } else {
      setMessage({ type: 'success', text: t('statusUpdated') });
      if (foundFarmer?.id === farmerId) {
        setFoundFarmer({ ...foundFarmer, status: newStatus });
      }
      setAllFarmers((prev) =>
        prev.map((f) => (f.id === farmerId ? { ...f, status: newStatus } : f))
      );
    }
    setUpdatingStatus(false);
  }

  async function handleSelectCentre(centreId: string) {
    if (!registeredFarmer) return;
    setSavingCentre(true);
    try {
      await updateFarmerCentre(registeredFarmer.id, centreId);
      setRegisteredFarmer({ ...registeredFarmer, procurement_centre_id: centreId });
      setMessage({ type: 'success', text: t('centreSelected') });
      setShowCentrePicker(false);
      await loadFarmers();
    } catch {
      setMessage({ type: 'error', text: t('saveError') });
    }
    setSavingCentre(false);
  }

  function getCentreName(id: string | null): string {
    if (!id) return t('noCentreSelected');
    return centres.find((c) => c.id === id)?.name ?? t('noCentreSelected');
  }

  const filteredCentres = centres.filter((c) =>
    !centreSearch ||
    c.name.toLowerCase().includes(centreSearch.toLowerCase()) ||
    (c.location ?? '').toLowerCase().includes(centreSearch.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-12 animate-fade-in">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <UserPlus className="w-5 h-5 text-forest-700" />
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
            {t('registerTitle')}
          </h1>
        </div>
        <p className="text-earth-500 text-sm">{t('registerSubtitle')}</p>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm font-medium ${
            message.type === 'success'
              ? 'bg-leaf-50 text-leaf-700 border border-leaf-100'
              : 'bg-red-50 text-red-700 border border-red-100'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          {message.text}
        </div>
      )}

      {/* Centre selection modal after registration */}
      {showCentrePicker && registeredFarmer && (
        <Card className="p-5 mb-6 border-forest-200">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-5 h-5 text-forest-700" />
            <h2 className="text-lg font-bold text-forest-900">{t('centrePrompt')}</h2>
          </div>
          <input
            type="text"
            value={centreSearch}
            onChange={(e) => setCentreSearch(e.target.value)}
            placeholder={t('searchCentre')}
            className="input mb-3"
          />
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredCentres.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelectCentre(c.id)}
                disabled={savingCentre}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition text-left disabled:opacity-50 ${
                  registeredFarmer.procurement_centre_id === c.id
                    ? 'border-forest-500 bg-forest-50'
                    : 'border-earth-200 hover:border-forest-300 hover:bg-cream-50'
                }`}
              >
                <Building2 className="w-5 h-5 text-forest-600 shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-forest-900">{c.name}</div>
                  <div className="text-xs text-earth-500">{c.location ?? '-'}, {c.district ?? '-'}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setShowCentrePicker(false)}
              className="btn-secondary"
            >
              {t('cancelEdit')}
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="btn-primary"
            >
              {t('goToDashboard')}
            </button>
          </div>
        </Card>
      )}

      {/* Registration form */}
      <Card className="p-5 mb-6">
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label={t('farmerName')} icon={UserPlus} required>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
                required
              />
            </FormField>
            <FormField label={t('mobileNumber')} icon={Phone} required>
              <input
                type="tel"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                className="input"
                placeholder="9876543210"
                required
              />
            </FormField>
            <FormField label={t('village')} icon={MapPin}>
              <input
                type="text"
                value={form.village}
                onChange={(e) => setForm({ ...form, village: e.target.value })}
                className="input"
              />
            </FormField>
            <FormField label={t('district')} icon={MapPin}>
              <input
                type="text"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="input"
              />
            </FormField>
            <FormField label={t('state')} icon={MapPin}>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="input"
              />
            </FormField>
            <FormField label={t('crop')} icon={Wheat}>
              <select
                value={form.crop}
                onChange={(e) => setForm({ ...form, crop: e.target.value })}
                className="input cursor-pointer"
              >
                <option value="">{t('selectCrop')}</option>
                {CROPS.map((c) => (
                  <option key={c.id} value={c.name.en}>
                    {c.name[lang as Language] ?? c.name.en}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto disabled:opacity-50">
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <UserPlus className="w-5 h-5" />
            )}
            {saving ? t('loading') : t('registerFarmer')}
          </button>
        </form>
      </Card>

      {/* Search */}
      <Card className="p-5 mb-6">
        <form onSubmit={handleSearch} className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <input
              type="tel"
              value={searchMobile}
              onChange={(e) => setSearchMobile(e.target.value)}
              placeholder={t('searchByMobile')}
              className="input text-base"
            />
          </div>
          <button type="submit" disabled={searching} className="btn-secondary disabled:opacity-50">
            {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            {t('searchFarmer')}
          </button>
        </form>

        {searchError && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 text-red-700 border border-red-100 flex items-center gap-2 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {searchError}
          </div>
        )}

        {foundFarmer && (
          <div className="mt-4 p-4 rounded-xl bg-leaf-50 border border-leaf-100">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-leaf-600" />
              <span className="font-bold text-leaf-700">{t('farmerFound')}</span>
            </div>
            <FarmerDetail farmer={foundFarmer} lang={lang} t={t} centreName={getCentreName(foundFarmer.procurement_centre_id)} />
            <StatusUpdater
              currentStatus={foundFarmer.status}
              updating={updatingStatus}
              onUpdate={(s) => updateStatus(foundFarmer.id, s)}
              t={t}
            />
          </div>
        )}
      </Card>

      {/* All farmers list */}
      <div>
        <h2 className="text-lg font-bold text-forest-900 mb-4">{t('registerTitle')}</h2>
        {loadingList ? (
          <div className="flex items-center justify-center py-8 text-earth-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            {t('loading')}
          </div>
        ) : listError ? (
          <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-100 text-sm">
            {listError}
          </div>
        ) : allFarmers.length === 0 ? (
          <div className="text-center py-8 text-earth-400">
            <UserPlus className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>{t('noFarmers')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allFarmers.map((farmer) => (
              <Card key={farmer.id} className="p-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedFarmer(expandedFarmer === farmer.id ? null : farmer.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center shrink-0">
                      <UserPlus className="w-5 h-5 text-forest-700" />
                    </div>
                    <div>
                      <div className="font-bold text-forest-900">{farmer.name}</div>
                      <div className="text-xs text-earth-500">{farmer.mobile}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge variant="active" label={t(STATUS_KEYS[farmer.status] ?? 'statusRegistered')} />
                    {expandedFarmer === farmer.id ? (
                      <ChevronUp className="w-5 h-5 text-earth-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-earth-400" />
                    )}
                  </div>
                </div>
                {expandedFarmer === farmer.id && (
                  <div className="mt-4 pt-4 border-t border-earth-100">
                    <FarmerDetail farmer={farmer} lang={lang} t={t} centreName={getCentreName(farmer.procurement_centre_id)} />
                    <StatusUpdater
                      currentStatus={farmer.status}
                      updating={updatingStatus}
                      onUpdate={(s) => updateStatus(farmer.id, s)}
                      t={t}
                    />
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FormField({
  label,
  icon: Icon,
  required,
  children,
}: {
  label: string;
  icon: typeof MapPin;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-earth-500 mb-1.5">
        <Icon className="w-3.5 h-3.5 inline mr-1" />
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function FarmerDetail({
  farmer,
  lang,
  t,
  centreName,
}: {
  farmer: Farmer;
  lang: string;
  t: (key: TranslationKey) => string;
  centreName: string;
}) {
  const locale = lang === 'haryanvi' ? 'hi-IN' : lang;
  const date = new Date(farmer.created_at).toLocaleDateString(locale);
  return (
    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
      <Detail label={t('farmerName')} value={farmer.name} />
      <Detail label={t('mobileNumber')} value={farmer.mobile} />
      <Detail label={t('village')} value={farmer.village ?? '-'} />
      <Detail label={t('district')} value={farmer.district ?? '-'} />
      <Detail label={t('state')} value={farmer.state ?? '-'} />
      <Detail label={t('crop')} value={farmer.crop ?? '-'} />
      <Detail label={t('procurementCentre')} value={centreName} />
      <Detail label={t('token')} value={`#${farmer.token ?? '-'}`} />
      <Detail label={t('registeredOn')} value={date} />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-earth-500">{label}</div>
      <div className="font-semibold text-forest-800">{value}</div>
    </div>
  );
}

function StatusUpdater({
  currentStatus,
  updating,
  onUpdate,
  t,
}: {
  currentStatus: string;
  updating: boolean;
  onUpdate: (status: string) => void;
  t: (key: TranslationKey) => string;
}) {
  return (
    <div className="mt-3">
      <label className="block text-xs font-semibold text-earth-500 mb-1.5">{t('updateStatus')}</label>
      <div className="flex gap-2 flex-wrap">
        {PROCUREMENT_STAGES.map((stage) => (
          <button
            key={stage}
            disabled={updating}
            onClick={() => onUpdate(stage)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50 ${
              currentStatus === stage
                ? 'bg-forest-700 text-white'
                : 'bg-white text-earth-600 border border-earth-200 hover:bg-forest-100'
            }`}
          >
            {t(STATUS_KEYS[stage] ?? 'statusRegistered')}
          </button>
        ))}
      </div>
    </div>
  );
}
