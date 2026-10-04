import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Farmer {
  id: string;
  name: string;
  mobile: string;
  village: string | null;
  district: string | null;
  state: string | null;
  crop: string | null;
  token: string | null;
  status: string;
  procurement_centre_id: string | null;
  created_at: string;
}

export interface ProcurementCentre {
  id: string;
  name: string;
  location: string | null;
  district: string | null;
  state: string | null;
  admin_contact: string | null;
  created_at: string;
}

export interface Procurement {
  id: string;
  farmer_id: string | null;
  lot_id: string | null;
  crop: string | null;
  center: string | null;
  current_stage: string;
  quantity: string | null;
  status_note: Record<string, string> | null;
  next_step: Record<string, string> | null;
  created_at: string;
  updated_at: string;
}

export const PROCUREMENT_STAGES = [
  'registered',
  'verified',
  'slot_booked',
  'arrived',
  'procured',
  'payment_sent',
  'payment_received',
] as const;

export type ProcurementStage = (typeof PROCUREMENT_STAGES)[number];

export async function fetchCentres(): Promise<ProcurementCentre[]> {
  const { data, error } = await supabase
    .from('procurement_centres')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return (data as ProcurementCentre[]) ?? [];
}

export async function fetchFarmerByMobile(mobile: string): Promise<Farmer | null> {
  const { data, error } = await supabase
    .from('farmers')
    .select('*')
    .eq('mobile', mobile)
    .maybeSingle();
  if (error) throw error;
  return data as Farmer | null;
}

export async function fetchFarmerById(id: string): Promise<Farmer | null> {
  const { data, error } = await supabase
    .from('farmers')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as Farmer | null;
}

export async function fetchAllFarmers(): Promise<Farmer[]> {
  const { data, error } = await supabase
    .from('farmers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Farmer[]) ?? [];
}

export async function updateFarmerStatus(farmerId: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('farmers')
    .update({ status })
    .eq('id', farmerId);
  if (error) throw error;
}

export async function updateFarmerCentre(farmerId: string, centreId: string): Promise<void> {
  const { error } = await supabase
    .from('farmers')
    .update({ procurement_centre_id: centreId })
    .eq('id', farmerId);
  if (error) throw error;
}

export async function updateFarmerProfile(
  farmerId: string,
  updates: Partial<Pick<Farmer, 'name' | 'village' | 'district' | 'state' | 'crop' | 'procurement_centre_id'>>
): Promise<void> {
  const { error } = await supabase
    .from('farmers')
    .update(updates)
    .eq('id', farmerId);
  if (error) throw error;
}
