import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { ArrowUpRight, ArrowLeft, ArrowRight, CalendarDays, Check, Info, LoaderCircle, MessageCircle, ShieldCheck, X } from 'lucide-react';
import { calculateQuote, getNightlyRate, getOccupancyLimits, PRICING_POLICY, type Quote } from '../lib/pricing';
import { isStayAvailable } from '../lib/calendar';
import CurrencyControls, { CurrencyProvider, useCurrency } from './CurrencyControls';
import { addDays, bangkokToday, buildWhatsAppRequest, readBookingOccupancy } from '../lib/booking';
import { AVAILABILITY_REFRESH_MS, availabilityFreshFor, requestAvailability, unverifiedAvailability, type ClientAvailability as Availability } from '../lib/availability-client';

type Stay = { slug: string; name: string; guests: number; image: string; };
const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const iso = (date: Date) => date.toISOString().slice(0, 10);
const displayDate = (date: string) => date ? new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : 'Select date';

export default function BookingWidget({ stays }: { stays: Stay[] }) {
  return <CurrencyProvider><BookingCalculator stays={stays} /></CurrencyProvider>;
}

function BookingCalculator({ stays }: { stays: Stay[] }) {
  const { currency, money, compactMoney } = useCurrency();
  const [property, setProperty] = useState(stays[0].slug);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guestLinkError, setGuestLinkError] = useState('');
  const [calendarState, setCalendarState] = useState<{ property: string; value: Availability } | null>(null);
  const knownByProperty = useRef(new Map<string, Availability>());
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const today = bangkokToday();
  const horizon = addDays(today, 365);
  const [month, setMonth] = useState(`${today.slice(0, 7)}-01`);
  const [selecting, setSelecting] = useState<'arrival' | 'departure'>('arrival');
  const stay = stays.find(item => item.slug === property) || stays[0];
  const limits = getOccupancyLimits(property);
  const knownAvailability = calendarState?.property === property ? calendarState.value : null;
  const availability = knownAvailability?.status === 'snapshot' && availabilityFreshFor(knownAvailability) === 0
    ? unverifiedAvailability(knownAvailability) : knownAvailability;
  const refreshAvailability = useCallback(() => {
    setLoading(true);
    setCalendarState(current => current ? { ...current, value: unverifiedAvailability(current.value) } : null);
    setRefresh(value => value + 1);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedProperty = params.get('property');
    const selected = stays.find(s => s.slug === requestedProperty) || stays[0];
    setProperty(selected.slug);
    try {
      const occupancy = readBookingOccupancy(params, selected.slug);
      setAdults(occupancy.adults);
      setChildren(occupancy.children);
    } catch (error) {
      setGuestLinkError(error instanceof Error ? error.message : 'Please check your guest counts.');
    }
    const arrival = params.get('checkIn') || '';
    const departure = params.get('checkOut') || '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(arrival) && arrival >= today && arrival <= horizon && !Number.isNaN(Date.parse(arrival))) {
      setCheckIn(arrival); setMonth(`${arrival.slice(0, 7)}-01`);
      if (/^\d{4}-\d{2}-\d{2}$/.test(departure) && departure > arrival && departure <= horizon) setCheckOut(departure);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let refreshTimer: number | undefined;
    const previous = knownByProperty.current.get(property);
    setLoading(true);
    setCalendarState({ property, value: unverifiedAvailability(previous) });
    requestAvailability(property, { signal: controller.signal, previous })
      .then(value => {
        if (controller.signal.aborted) return;
        const freshFor = availabilityFreshFor(value);
        const current = value.status === 'snapshot' && freshFor === 0 ? unverifiedAvailability(value) : value;
        knownByProperty.current.set(property, current);
        setCalendarState({ property, value: current });
        refreshTimer = window.setTimeout(refreshAvailability, value.status === 'snapshot' ? Math.min(freshFor, AVAILABILITY_REFRESH_MS) : AVAILABILITY_REFRESH_MS);
      })
      .catch(() => {
        // Superseded requests must not overwrite the selected apartment's state.
        if (controller.signal.aborted) return;
        const current = unverifiedAvailability(previous);
        knownByProperty.current.set(property, current);
        setCalendarState({ property, value: current });
        refreshTimer = window.setTimeout(refreshAvailability, AVAILABILITY_REFRESH_MS);
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => { controller.abort(); window.clearTimeout(refreshTimer); };
  }, [property, refresh, refreshAvailability]);

  useEffect(() => {
    const recheckVisiblePage = () => {
      if (document.visibilityState === 'visible') refreshAvailability();
    };
    window.addEventListener('focus', recheckVisiblePage);
    document.addEventListener('visibilitychange', recheckVisiblePage);
    return () => {
      window.removeEventListener('focus', recheckVisiblePage);
      document.removeEventListener('visibilitychange', recheckVisiblePage);
    };
  }, [refreshAvailability]);

  const result = useMemo<{ quote: Quote | null; error: string }>(() => {
    if (guestLinkError) return { quote: null, error: '' };
    if (!checkIn || !checkOut) return { quote: null, error: '' };
    try {
      if (checkIn < today) throw new Error('Please choose an arrival date from today onward.');
      if (checkOut > horizon) throw new Error('For dates more than a year away, please contact us.');
      return { quote: calculateQuote({ propertyId: property, checkIn, checkOut, adults, children }), error: '' };
    } catch (error) { return { quote: null, error: error instanceof Error ? error.message : 'Please check your dates.' }; }
  }, [property, checkIn, checkOut, adults, children, guestLinkError, today, horizon]);

  const conflicts = result.quote && availability?.blocked.length ? !isStayAvailable(checkIn, checkOut, availability.blocked) : false;
  const handoff = result.quote && !conflicts && !loading && availability ? buildWhatsAppRequest(stay.name, result.quote, availability.status) : null;
  const guardHandoff = (event: MouseEvent<HTMLAnchorElement>) => {
    // Recheck at activation too: background tabs may defer the expiry timer.
    if (availability?.status === 'snapshot' && availabilityFreshFor(availability) === 0) {
      event.preventDefault();
      refreshAvailability();
    }
  };
  const blocked = (date: string) => availability?.blocked.some(range => date >= range.start && date < range.end) || false;
  const changeMonth = (offset: number) => { const date = new Date(`${month}T12:00:00Z`); date.setUTCMonth(date.getUTCMonth() + offset); setMonth(iso(date)); };
  const chooseDate = (date: string) => {
    if (selecting === 'arrival' || !checkIn || date <= checkIn) {
      setCheckIn(date);
      if (!checkOut || checkOut < addDays(date, PRICING_POLICY.minNights)) setCheckOut('');
      setSelecting('departure');
    }
    else { setCheckOut(date); setSelecting('arrival'); }
  };
  const selectProperty = (slug: string) => {
    const nextLimits = getOccupancyLimits(slug);
    setProperty(slug);
    setAdults(value => Math.min(value, nextLimits.maxAdults));
    setChildren(value => Math.min(value, nextLimits.maxChildren));
    setGuestLinkError('');
  };
  const selectDateField = (field: 'arrival' | 'departure') => {
    setSelecting(field);
    const selectedDate = field === 'arrival' ? checkIn : checkOut || checkIn;
    if (selectedDate) setMonth(`${selectedDate.slice(0, 7)}-01`);
  };
  const reset = () => { setCheckIn(''); setCheckOut(''); setSelecting('arrival'); };

  function monthView(offset: number) {
    const start = new Date(`${month}T12:00:00Z`); start.setUTCMonth(start.getUTCMonth() + offset);
    const leading = (start.getUTCDay() + 6) % 7;
    const days = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)).getUTCDate();
    return <div className="calendar-month" key={offset}>
      <h3>{start.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })}</h3>
      <div className="calendar-weekdays" aria-hidden="true">{dayLabels.map((day, index) => <span key={index}>{day}</span>)}</div>
      <div className="calendar-days">
        {Array.from({ length: leading }, (_, index) => <span key={`blank-${index}`} />)}
        {Array.from({ length: days }, (_, index) => {
          const date = iso(new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), index + 1, 12)));
          const busy = blocked(date);
          // A blocked arrival day can be used as departure because checkout is exclusive.
          const departureOnly = busy && selecting === 'departure' && !!checkIn && date > checkIn && !!availability && isStayAvailable(checkIn, date, availability.blocked);
          const tooShort = selecting === 'departure' && !!checkIn && date > checkIn && date < addDays(checkIn, PRICING_POLICY.minNights);
          const unavailable = date < today || date > horizon || (busy && !departureOnly) || tooShort;
          const selected = date === checkIn || date === checkOut;
          const between = !!checkIn && !!checkOut && date > checkIn && date < checkOut;
          const rate = getNightlyRate(date, property);
          const text = new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
          return <button key={date} type="button" disabled={unavailable} aria-pressed={selected} aria-label={`${text}${tooShort ? ', minimum 7-night stay' : busy && !departureOnly ? ', unavailable' : departureOnly ? ', check-out only' : ''}, ${money(rate)}`} className={`calendar-day ${selected ? 'selected' : ''} ${between ? 'in-range' : ''} ${busy ? 'blocked' : ''} ${date === today ? 'today' : ''} ${departureOnly ? 'departure-only' : ''}`} onClick={() => chooseDate(date)}><span>{index + 1}</span><small>{!busy || departureOnly ? compactMoney(rate) : '—'}</small></button>;
        })}
      </div>
    </div>;
  }

  return <><div className="booking-currency-bar"><p>{PRICING_POLICY.minNights}-night minimum<br /><span>10% off weekly stays · 20% off 28+ nights</span></p><CurrencyControls /></div><div className="booking-layout">
    <div className="booking-main">
      <div className="booking-step"><span>01</span><h2>Choose your little escape</h2></div>
      <div className="stay-picker" role="group" aria-label="Choose an apartment">{stays.map(item => {
        const capacity = getOccupancyLimits(item.slug);
        return <button type="button" key={item.slug} className={`stay-option ${capacity.maxAdults > 2 ? 'combined' : ''} ${property === item.slug ? 'active' : ''}`} aria-pressed={property === item.slug} onClick={() => selectProperty(item.slug)}><img src={item.image} alt="" width="100" height="80"/><span><strong>{item.name}</strong><small>Up to {capacity.maxAdults} adults + {capacity.maxChildren} children · ages 14 or under</small></span><span className="radio-circle">{property === item.slug && <Check size={13}/>}</span></button>;
      })}</div>
      <div className="booking-step"><span>02</span><h2>Choose your dates</h2></div>
      <div className="booking-dates" role="group" aria-label="Your dates">
        <button type="button" aria-label="Choose check-in date" aria-pressed={selecting === 'arrival'} onClick={() => selectDateField('arrival')}><span>Check-in</span><strong>{displayDate(checkIn)}</strong><small>From 15:00</small></button>
        <button type="button" aria-label="Choose check-out date" aria-pressed={selecting === 'departure'} onClick={() => selectDateField('departure')}><span>Check-out</span><strong>{displayDate(checkOut)}</strong><small>By 12:00</small></button>
      </div>
      <div className="calendar-status" aria-live="polite">{loading ? <><LoaderCircle size={15} className="spin"/> Loading calendar updates…</> : availability?.status === 'snapshot' ? <><span className="status-dot"/> Calendar updated {new Date(availability.checkedAt!).toLocaleString('en-GB', { timeZone: 'Asia/Bangkok', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} · Phuket time</> : <><Info size={15}/> Calendar temporarily unavailable. You can still request dates.</>}</div>
      <div className="calendar-shell" aria-label="Availability calendar" aria-busy={loading}>
        <div className="calendar-toolbar"><p>{selecting === 'departure' && checkIn ? 'Now choose your departure' : 'Choose your arrival date'}<span className="calendar-currency">{currency} / night</span></p><div><button aria-label="Previous month" disabled={month <= `${today.slice(0, 7)}-01`} onClick={() => changeMonth(-1)}><ArrowLeft size={17}/></button><button aria-label="Next month" disabled={month >= `${horizon.slice(0, 7)}-01`} onClick={() => changeMonth(1)}><ArrowRight size={17}/></button></div></div>
        <div className="calendar-pair">{monthView(0)}{monthView(1)}</div>
        <div className="calendar-legend"><span><i className="legend-open"/>{availability?.status === 'snapshot' ? 'Open on calendar' : 'Not yet verified'}</span><span><i className="legend-blocked"/>Unavailable</span><span><i className="legend-selected"/>Your dates</span><button onClick={reset}>Clear dates</button></div>
      </div>
      <p className="calendar-explainer">Nightly accommodation in {currency}, before discounts and fees. Calendars update periodically; availability is confirmed before booking.</p>
      <div className="booking-step"><span>03</span><h2>Who’s coming?</h2></div>
      <div className="booking-fields booking-guests">
        <label htmlFor="booking-adults">Adults · ages 15+<select id="booking-adults" aria-describedby="guest-policy" value={adults} onChange={event => { setAdults(Number(event.target.value)); setGuestLinkError(''); }}>{Array.from({ length: limits.maxAdults }, (_, index) => <option value={index + 1} key={index + 1}>{index + 1} adult{index > 0 ? 's' : ''}</option>)}</select></label>
        <label htmlFor="booking-children">Children · ages 14 or under<select id="booking-children" aria-describedby="guest-policy" value={children} onChange={event => { setChildren(Number(event.target.value)); setGuestLinkError(''); }}>{Array.from({ length: limits.maxChildren + 1 }, (_, index) => <option value={index} key={index}>{index} {index === 1 ? 'child' : 'children'}</option>)}</select></label>
      </div>
      <p className="guest-policy" id="guest-policy">Up to {limits.maxAdults} adults and {limits.maxChildren} children aged 14 or under. The rate includes {limits.includedGuests} guests; each extra child is {money(PRICING_POLICY.extraGuestNightlyRate)} per night. Guests aged 15+ count as adults.</p>
      {guestLinkError && <div className="booking-error" role="alert"><Info size={17}/><div><p>The guest counts in this link need checking. {guestLinkError}</p><button type="button" onClick={() => setGuestLinkError('')}>Use {adults} adult{adults === 1 ? '' : 's'} and {children} {children === 1 ? 'child' : 'children'}</button></div></div>}
      {result.error && <p className="booking-error" role="alert"><Info size={17}/>{result.error}</p>}
      {conflicts && <p className="booking-error" role="alert"><X size={17}/>These dates overlap an unavailable night. Try another apartment or choose different dates.</p>}
      <p className="arrival-details">Check-in from 15:00; check-out by 12:00. A local agent will meet you on arrival. Early check-in and late check-out are available on request, subject to availability and may cost extra.</p>
      <div className="booking-assurances"><div><ShieldCheck size={22}/><span><strong>No payment here</strong><small>Confirm payment and cancellation terms before booking.</small></span></div><div><MessageCircle size={22}/><span><strong>A real conversation</strong><small>Send your request to arrange your stay.</small></span></div></div>
    </div>
    <aside className="quote-panel" aria-label="Your stay estimate">
      <div className={`quote-image ${limits.maxAdults > 2 ? 'combined' : ''}`}><img src={stay.image} alt={stay.name} width="540" height="400"/></div>
      <div className="quote-content"><p className="eyebrow">YOUR TIME IN RAWAI</p><h2>{stay.name}</h2><p className="quote-caption">The Title V · Rawai, Phuket</p>
        {result.quote ? <div className="price-summary" aria-live="polite">
          <p className="quote-occupancy">{result.quote.adults} adult{result.quote.adults === 1 ? '' : 's'} · {result.quote.children} {result.quote.children === 1 ? 'child' : 'children'} · {result.quote.guests} total</p>
          <div className="quote-row"><span>Accommodation · {result.quote.nights} nights</span><strong>{money(result.quote.baseTotal)}</strong></div>
          {result.quote.discountRate > 0 && <div className="quote-row savings"><span>{result.quote.discountLabel} · {result.quote.discountRate * 100}% off lodging</span><strong>−{money(result.quote.discountTotal)}</strong></div>}
          <div className="quote-row"><span>Extra children<small>{result.quote.extraGuests > 0 ? `${result.quote.extraGuests} × ${money(PRICING_POLICY.extraGuestNightlyRate)} × ${result.quote.nights} nights` : 'Within the included guest count'}</small></span><strong>{money(result.quote.extraGuestTotal)}</strong></div>
          <div className="quote-row"><span>Cleaning · per stay</span><strong>{money(result.quote.cleaningTotal)}</strong></div>
          <div className="quote-total"><span>Stay estimate<small>Excludes utilities and refundable deposit</small></span><strong>{money(result.quote.total)}</strong></div>
          <div className="quote-deposit"><div className="quote-row"><span>Refundable deposit<small>Separate · per booking</small></span><strong>{money(result.quote.refundableDeposit)}</strong></div><p>Stay estimate + refundable deposit: <strong>{money(result.quote.totalIncludingDeposit)}</strong>. Payment arrangements are confirmed before booking.</p></div>
          <details className="nightly-details"><summary>See nightly accommodation rates</summary><div>{result.quote.nightly.map(night => <p key={night.date}><span>{night.date}</span><span>{money(night.rate)}</span></p>)}</div></details>
        </div> : <div className="empty-quote"><CalendarDays size={25}/><p>{guestLinkError ? 'Check your guest counts to continue.' : <>Your escape starts with a date.<br /><span>Select arrival and departure to see your estimate.</span></>}</p></div>}
        {handoff ? <a className="button whatsapp-button" data-testid="whatsapp-request" href={handoff} target="_blank" rel="noopener noreferrer" onClick={guardHandoff} onAuxClick={guardHandoff}>{availability?.status === 'snapshot' ? 'Request this stay' : 'Ask about these dates'} <ArrowUpRight size={18}/></a> : <button className="button whatsapp-button" disabled>{loading && result.quote ? 'Checking your dates…' : conflicts ? 'Choose different dates' : guestLinkError ? 'Check guest counts' : 'Choose your dates'} <ArrowUpRight size={18}/></button>}
        <p className="quote-disclaimer">Opens WhatsApp with your request. Nothing is sent automatically, and no payment is taken.</p>
        <div className="quote-note"><Info size={16}/><p>Metered utilities are excluded: water {money(PRICING_POLICY.waterPerCubicMeter)}/m³ and electricity {money(PRICING_POLICY.electricityPerKwh)}/kWh. Availability, payment and cancellation terms are confirmed before booking.</p></div>
        <p className="discount-hint">Save 10% on accommodation for 7+ nights,<br/>or 20% for 28+ nights.</p>
      </div>
    </aside>
  </div></>;
}
