import {
  visaCountries, tourismExemption30, tourismExemption15,
  bilateralExemption14, bilateralExemption30, bilateralExemption90, visaOnArrival15,
} from '../data/visas';

export interface VisaAdvice {
  kind: 'unselected' | 'check' | 'thai' | 'visa-exempt' | 'visa-on-arrival' | 'visa-required';
  days?: number;
  basis?: 'tourism-scheme' | 'bilateral';
  notes: string[];
}

const knownCountries = new Set(visaCountries.map(country => country.code));

/** Only classify listed ordinary passports; unrecognised documents fail closed. */
export function getVisaAdvice(code: string): VisaAdvice {
  if (code === '') return { kind: 'unselected', notes: [] };
  if (!knownCountries.has(code)) return { kind: 'check', notes: [] };
  if (code === 'TH') return { kind: 'thai', notes: [] };

  const notes: string[] = [];
  if (code === 'MM') notes.push('The 14-day exemption is for arrivals through international airports only. For a land or sea arrival, check with the Thai embassy before travelling.');
  if (code === 'CN') notes.push('The bilateral agreement also limits total visits to 90 days in any 180-day period.');
  if (code === 'KZ') notes.push('The bilateral agreement also limits total visits to 90 days in any 180-day period.');
  if (code === 'HK' || code === 'MO') notes.push('This result is for a SAR passport. A different travel document or British National (Overseas) passport needs its own embassy check.');
  if (code === 'GB') notes.push('This result is for an ordinary British citizen passport. Other British nationality categories and travel documents need a separate embassy check.');

  if (bilateralExemption14.has(code)) return { kind: 'visa-exempt', days: 14, basis: 'bilateral', notes };
  if (bilateralExemption30.has(code)) return { kind: 'visa-exempt', days: 30, basis: 'bilateral', notes };
  if (bilateralExemption90.has(code)) return { kind: 'visa-exempt', days: 90, basis: 'bilateral', notes };
  if (tourismExemption30.has(code)) return { kind: 'visa-exempt', days: 30, basis: 'tourism-scheme', notes };
  if (tourismExemption15.has(code)) return { kind: 'visa-exempt', days: 15, basis: 'tourism-scheme', notes };
  if (visaOnArrival15.has(code)) return { kind: 'visa-on-arrival', days: 15, notes };
  return { kind: 'visa-required', notes };
}
