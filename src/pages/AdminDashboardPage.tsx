import { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle, CalendarCheck, Tractor, Scale, Wallet, Loader2, AlertCircle, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage, type TranslationKey } from '@/context/LanguageContext';
import { Card, StatusBadge } from '@/components/ui';
import { Logo } from '@/components/Logo';
import {
  supabase,
  type Farmer,
  type ProcurementCentre,
  PROCUREMENT_STAGES,
  fetchCentres,
  updateFarmerStatus,
} from '@/lib/supabase';
import type { Page } from '@/App';

const STATUS_KEYS: Record<string, TranslationKey> = {
  registered: 'statusRegistered',
  verified: 'statusVerified',
  slot_booked: 'statusSlotBooked',
  arrived: 'statusArrived',
  procured: 'statusProcured',
  payment_sent: 'statusPaymentSent',
  payment_received: 'statusPaymentReceived',
};

export function AdminDashboardPage({
  initialTab = 'dashboard',
}: {
  onNavigate: (page: Page) => void;
  initialTab?: 'dashboard' | 'farmers' | 'settings';
}) {
  const { t } = useLanguage();
  const [tab, setTab] = useState<'dashboard' | 'farmers' | 'settings'>(initialTab);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [centres, setCentres] = useState<ProcurementCentre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [centreFilter, setCentreFilter] = useState('all');
  const [expandedFarmer, setExpandedFarmer] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    async function load() {
      const { data, error: dbError } = await supabase
        .from('farmers')
        .select('*')
        .order('created_at', { ascending: false });
      if (dbError) {
        setError(true);
      } else {
        setFarmers((data as Farmer[]) ?? []);
      }
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

  async function handleStatusUpdate(farmerId: string, newStatus: string) {
    setUpdatingStatus(true);
    setStatusMsg(null);
    try {
      await updateFarmerStatus(farmerId, newStatus);
      setFarmers((prev) =>
        prev.map((f) => (f.id === farmerId ? { ...f, status: newStatus } : f))
      );
      setStatusMsg({ type: 'success', text: t('statusUpdated') });
    } catch {
      setStatusMsg({ type: 'error', text: t('statusUpdateFailed') });
    }
    setUpdatingStatus(false);
  }

  function getCentreName(id: string | null): string {
    if (!id) return '-';
    return centres.find((c) => c.id === id)?.name ?? '-';
  }

  const stats = {
    total: farmers.length,
    waiting: farmers.filter((f) => f.status === 'registered').length,
    verified: farmers.filter((f) => f.status === 'verified').length,
    slotBooked: farmers.filter((f) => f.status === 'slot_booked').length,
    arrived: farmers.filter((f) => f.status === 'arrived').length,
    procured: farmers.filter((f) => f.status === 'procured').length,
    paymentsPending: farmers.filter((f) => f.status === 'payment_sent').length,
  };

  const filtered = farmers.filter((f) => {
    const matchSearch =
      !search ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.mobile.includes(search);
    const matchCentre = centreFilter === 'all' || f.procurement_centre_id === centreFilter;
    return matchSearch && matchCentre;
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-12 flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 animate-spin text-forest-600 mr-3" />
        <span className="text-earth-500 font-medium">{t('loading')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-12">
        <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-100 flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {t('saveError')}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-12 animate-fade-in">
      <div className="mb-6 flex items-center gap-3">
        <Logo size={56} className="shrink-0" />
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
            {t('adminTitle')}
          </h1>
        </div>
        <p className="text-earth-500 text-sm mt-1">{t('adminSubtitle')}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-earth-200/60">
        {(['dashboard', 'farmers', 'settings'] as const).map((tabId) => (
          <button
            key={tabId}
            onClick={() => setTab(tabId)}
            className={`px-4 py-2.5 font-semibold text-sm transition border-b-2 -mb-px ${
              tab === tabId
                ? 'border-forest-700 text-forest-700'
                : 'border-transparent text-earth-400 hover:text-forest-600'
            }`}
          >
            {tabId === 'dashboard' ? t('navAdminDashboard') : tabId === 'farmers' ? t('navAdminFarmers') : t('navAdminSettings')}
          </button>
        ))}
      </div>

      {statusMsg && (
        <div
          className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm font-medium ${
            statusMsg.type === 'success'
              ? 'bg-leaf-50 text-leaf-700 border border-leaf-100'
              : 'bg-red-50 text-red-700 border border-red-100'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          {statusMsg.text}
        </div>
      )}

      {tab === 'dashboard' && (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon={Users} label={t('totalFarmers')} value={stats.total} color="forest" />
            <StatCard icon={Clock} label={t('farmersWaiting')} value={stats.waiting} color="saffron" />
            <StatCard icon={CheckCircle} label={t('farmersVerified')} value={stats.verified} color="leaf" />
            <StatCard icon={CalendarCheck} label={t('farmersSlotBooked')} value={stats.slotBooked} color="forest" />
            <StatCard icon={Tractor} label={t('farmersArrived')} value={stats.arrived} color="saffron" />
            <StatCard icon={Scale} label={t('farmersProcured')} value={stats.procured} color="leaf" />
            <StatCard icon={Wallet} label={t('paymentsPending')} value={stats.paymentsPending} color="saffron" />
          </div>

          {/* Quick farmer list */}
          <h2 className="text-lg font-bold text-forest-900 mb-4">{t('farmerManagement')}</h2>
          {farmers.length === 0 ? (
            <div className="text-center py-12 text-earth-400">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>{t('noFarmersAdmin')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {farmers.slice(0, 5).map((f) => (
                <Card key={f.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-forest-700" />
                      </div>
                      <div>
                        <div className="font-bold text-forest-900">{f.name}</div>
                        <div className="text-xs text-earth-500">{f.mobile} · {getCentreName(f.procurement_centre_id)}</div>
                      </div>
                    </div>
                    <StatusBadge variant="active" label={t(STATUS_KEYS[f.status] ?? 'statusRegistered')} />
                  </div>
                </Card>
              ))}
              {farmers.length > 5 && (
                <button onClick={() => setTab('farmers')} className="text-sm font-semibold text-forest-600 hover:text-forest-800">
                  {t('farmerManagement')} →
                </button>
              )}
            </div>
          )}
        </>
      )}

      {tab === 'farmers' && (
        <>
          {/* Filters */}
          <div className="flex gap-3 flex-wrap mb-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('searchByMobile')}
                className="input pl-10"
              />
            </div>
            <select
              value={centreFilter}
              onChange={(e) => setCentreFilter(e.target.value)}
              className="input cursor-pointer min-w-[160px]"
            >
              <option value="all">{t('allCentresFilter')}</option>
              {centres.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-earth-400">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>{t('noFarmersAdmin')}</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-earth-500 border-b border-earth-200">
                      <th className="pb-2 pr-4">{t('farmerName')}</th>
                      <th className="pb-2 pr-4">{t('mobileNumber')}</th>
                      <th className="pb-2 pr-4">{t('village')}</th>
                      <th className="pb-2 pr-4">{t('crop')}</th>
                      <th className="pb-2 pr-4">{t('adminCentre')}</th>
                      <th className="pb-2 pr-4">{t('currentStatus')}</th>
                      <th className="pb-2">{t('action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((f) => (
                      <tr key={f.id} className="border-b border-earth-100 hover:bg-cream-50">
                        <td className="py-3 pr-4 font-semibold text-forest-900">{f.name}</td>
                        <td className="py-3 pr-4 text-sm text-earth-600">{f.mobile}</td>
                        <td className="py-3 pr-4 text-sm text-earth-600">{f.village ?? '-'}</td>
                        <td className="py-3 pr-4 text-sm text-earth-600">{f.crop ?? '-'}</td>
                        <td className="py-3 pr-4 text-sm text-earth-600">{getCentreName(f.procurement_centre_id)}</td>
                        <td className="py-3 pr-4">
                          <StatusBadge variant="active" label={t(STATUS_KEYS[f.status] ?? 'statusRegistered')} />
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => setExpandedFarmer(expandedFarmer === f.id ? null : f.id)}
                            className="text-sm font-semibold text-forest-600 hover:text-forest-800"
                          >
                            {t('updateFarmerStatus')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden space-y-3">
                {filtered.map((f) => (
                  <Card key={f.id} className="p-4">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedFarmer(expandedFarmer === f.id ? null : f.id)}
                    >
                      <div>
                        <div className="font-bold text-forest-900">{f.name}</div>
                        <div className="text-xs text-earth-500">{f.mobile}</div>
                        <div className="text-xs text-earth-500 mt-0.5">{getCentreName(f.procurement_centre_id)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge variant="active" label={t(STATUS_KEYS[f.status] ?? 'statusRegistered')} />
                        {expandedFarmer === f.id ? <ChevronUp className="w-5 h-5 text-earth-400" /> : <ChevronDown className="w-5 h-5 text-earth-400" />}
                      </div>
                    </div>
                    {expandedFarmer === f.id && (
                      <div className="mt-4 pt-4 border-t border-earth-100">
                        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                          <div><span className="text-earth-500">{t('village')}:</span> <span className="font-semibold text-forest-800">{f.village ?? '-'}</span></div>
                          <div><span className="text-earth-500">{t('crop')}:</span> <span className="font-semibold text-forest-800">{f.crop ?? '-'}</span></div>
                        </div>
                        <StatusButtons currentStatus={f.status} updating={updatingStatus} onUpdate={(s) => handleStatusUpdate(f.id, s)} t={t} />
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              {/* Desktop expanded status panel */}
              {expandedFarmer && (
                <div className="hidden sm:block mt-4">
                  {filtered.filter((f) => f.id === expandedFarmer).map((f) => (
                    <Card key={f.id} className="p-4">
                      <div className="text-sm font-bold text-forest-900 mb-3">{f.name} — {t('updateFarmerStatus')}</div>
                      <StatusButtons currentStatus={f.status} updating={updatingStatus} onUpdate={(s) => handleStatusUpdate(f.id, s)} t={t} />
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {tab === 'settings' && (
        <Card className="p-5">
          <h2 className="text-lg font-bold text-forest-900 mb-4">{t('navAdminSettings')}</h2>
          <div className="space-y-3">
            {centres.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-cream-50 border border-earth-100">
                <div>
                  <div className="font-semibold text-forest-900">{c.name}</div>
                  <div className="text-xs text-earth-500">{c.location ?? '-'}, {c.district ?? '-'}</div>
                </div>
                <div className="text-sm font-semibold text-saffron-600">{c.admin_contact ?? '-'}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  color: 'forest' | 'leaf' | 'saffron';
}) {
  const colors = {
    forest: 'bg-forest-100 text-forest-700',
    leaf: 'bg-leaf-100 text-leaf-700',
    saffron: 'bg-saffron-100 text-saffron-700',
  };
  return (
    <Card className="p-4">
      <div className={`inline-flex w-10 h-10 rounded-xl items-center justify-center mb-2 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-bold text-forest-900">{value}</div>
      <div className="text-xs text-earth-500 font-medium">{label}</div>
    </Card>
  );
}

function StatusButtons({
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
  );
}
