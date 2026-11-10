import { createContext, useCallback, useContext, useEffect, useId, useState, type ReactNode } from 'react';
import { CURRENCIES, FX_MAX_AGE_MS, formatCurrency, getExchangeRates, readDisplayCurrency, type CurrencyCode, type ExchangeResult } from '../lib/currency';

const PREFERENCE_KEY = 'title-v-display-currency';
const CurrencyContext = createContext<ReturnType<typeof useCurrencyState> | null>(null);

function useCurrencyState(currencyFromUrl: boolean) {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('THB');
  const [preferenceReady, setPreferenceReady] = useState(false);
  const [result, setResult] = useState<ExchangeResult>({ status: 'unavailable', snapshot: null });
  const [loading, setLoading] = useState(true);
  const restoreCurrencyPreference = useCallback(() => {
    let saved: string | null = null;
    try { saved = window.localStorage.getItem(PREFERENCE_KEY); } catch { /* Storage is optional. */ }
    const requested = currencyFromUrl ? new URLSearchParams(window.location.search).get('currency') : null;
    setSelectedCurrency(readDisplayCurrency(requested, saved));
    setPreferenceReady(true);
  }, [currencyFromUrl]);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    let storage: Storage | undefined;
    try {
      storage = window.localStorage;
    } catch { /* Browser privacy settings can disable storage. */ }
    restoreCurrencyPreference();
    const refresh = async () => {
      setLoading(true);
      const next = await getExchangeRates({ storage });
      if (!active) return;
      setResult(next);
      setLoading(false);
      // Recheck aging data while the page stays open; fresh cache avoids a fetch.
      const expiresIn = next.snapshot ? next.snapshot.updatedAt + FX_MAX_AGE_MS - Date.now() : 3_600_000;
      timer = setTimeout(refresh, Math.max(1000, Math.min(3_600_000, expiresIn)));
    };
    void refresh();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [restoreCurrencyPreference]);

  const snapshot = result.snapshot && Date.now() - result.snapshot.updatedAt < FX_MAX_AGE_MS ? result.snapshot : null;
  const currency = snapshot ? selectedCurrency : 'THB';
  const setCurrency = (next: CurrencyCode) => {
    if (!CURRENCIES.some(({ code }) => code === next)) return;
    setSelectedCurrency(next);
    try { window.localStorage.setItem(PREFERENCE_KEY, next); } catch { /* Preference is optional. */ }
  };
  return {
    selectedCurrency, currency, setCurrency, loading, preferenceReady, restoreCurrencyPreference,
    result: snapshot ? result : { status: 'unavailable', snapshot: null } as ExchangeResult,
    money: (amount: number) => formatCurrency(amount, currency, snapshot),
    compactMoney: (amount: number) => formatCurrency(amount, currency, snapshot, true),
  };
}

export function CurrencyProvider({ children, currencyFromUrl = false }: { children: ReactNode; currencyFromUrl?: boolean }) {
  return <CurrencyContext.Provider value={useCurrencyState(currencyFromUrl)}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const currency = useContext(CurrencyContext);
  if (!currency) throw new Error('Currency controls need a provider.');
  return currency;
}

export default function CurrencyControls() {
  const { selectedCurrency, setCurrency, loading, result } = useCurrency();
  const id = useId();
  const date = result.snapshot ? new Date(result.snapshot.updatedAt) : null;
  return <div className="currency-controls">
    <label htmlFor={id}>Display currency<select id={id} value={selectedCurrency} aria-label="Display currency" aria-describedby={`${id}-status`} onChange={event => setCurrency(event.target.value as CurrencyCode)}>
      {CURRENCIES.map(({ code, name }) => <option key={code} value={code}>{code} · {name}</option>)}
    </select></label>
    <p className="currency-status" id={`${id}-status`} aria-live="polite">
      {loading ? 'Updating daily exchange rates…' : date ? <>{result.status === 'saved' ? 'Saved rates' : 'Daily rates'} · <time dateTime={date.toISOString()}>{date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}</time> · approximate</> : 'Conversions unavailable · prices shown in THB.'}
      <span>Booking requests use THB. <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer">Rates by ExchangeRate-API</a></span>
    </p>
  </div>;
}
