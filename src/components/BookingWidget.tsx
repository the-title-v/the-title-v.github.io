import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { ArrowUpRight, ArrowLeft, ArrowRight, CalendarDays, Check, Info, LoaderCircle, MessageCircle, ShieldCheck, X } from 'lucide-react';
import { calculateQuote, getNightlyRate, PRICING_POLICY, type Quote } from '../lib/pricing';
import { isStayAvailable } from '../lib/calendar';
import { addDays, bangkokToday, buildWhatsAppRequest, formatTHB } from '../lib/booking';
import { AVAILABILITY_FRESH_MS, availabilityFreshFor, requestAvailability, unverifiedAvailability, type ClientAvailability as Availability } from '../lib/availability-client';

type Stay = { slug: string; name: string; guests: number; image: string; };
const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const iso = (date: Date) => date.toISOString().slice(0, 10);

export default function BookingWidget({ stays }: { stays: Stay[] }) {
  const [property, setProperty] = useState(stays[0].slug);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [calendarState, setCalendarState] = useState<{ property: string; value: Availability } | null>(null);
  const knownByProperty = useRef(new Map<string, Availability>());
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const today = bangkokToday();
  const horizon = addDays(today, 365);
  const [month, setMonth] = useState(`${today.slice(0, 7)}-01`);
  const [selecting, setSelecting] = useState<'arrival' | 'departure'>('arrival');
  const stay = stays.find(item => item.slug === property) || stays[0];
  const knownAvailability = calendarState?.property === property ? calendarState.value : null;
  const availability = knownAvailability?.status === 'live' && availabilityFreshFor(knownAvailability) === 0
    ? unverifiedAvailability(knownAvailability) : knownAvailability;
  const refreshAvailability = useCallback(() => {
    setLoading(true);
    setCalendarState(current => current ? { ...current, value: unverifiedAvailability(current.value) } : null);
    setRefresh(value => value + 1);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedGuests = Number(params.get('guests') || 2);
    const requestedProperty = params.get('property');
    const selected = stays.find(s => s.slug === requestedProperty) || (requestedGuests > 4 ? stays[2] : stays[0]);
    setProperty(selected.slug);
    setGuests(Math.min(selected.guests, Math.max(1, Number.isInteger(requestedGuests) ? requestedGuests : 2)));
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
        const current = value.status === 'live' && freshFor === 0 ? unverifiedAvailability(value) : value;
        knownByProperty.current.set(property, current);
        setCalendarState({ property, value: current });
        refreshTimer = window.setTimeout(refreshAvailability, value.status === 'live' ? freshFor : AVAILABILITY_FRESH_MS);
      })
      .catch(() => {
        // Superseded requests must not overwrite the selected apartment's state.
        if (controller.signal.aborted) return;
        const current = unverifiedAvailability(previous);
        knownByProperty.current.set(property, current);
        setCalendarState({ property, value: current });
        refreshTimer = window.setTimeout(refreshAvailability, AVAILABILITY_FRESH_MS);
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
    if (!checkIn || !checkOut) return { quote: null, error: '' };
    try {
      if (checkIn < today) throw new Error('Please choose an arrival date from today onward.');
      if (checkOut > horizon) throw new Error('For dates more than a year away, please contact your host.');
      return { quote: calculateQuote({ propertyId: property, checkIn, checkOut, guests }), error: '' };
    } catch (error) { return { quote: null, error: error instanceof Error ? error.message : 'Please check your dates.' }; }
  }, [property, checkIn, checkOut, guests, today, horizon]);

  const conflicts = result.quote && availability?.blocked.length ? !isStayAvailable(checkIn, checkOut, availability.blocked) : false;
  const handoff = result.quote && !conflicts && !loading && availability ? buildWhatsAppRequest(stay.name, result.quote, availability.status) : null;
  const guardHandoff = (event: MouseEvent<HTMLAnchorElement>) => {
    // Recheck at activation too: background tabs may defer the expiry timer.
    if (availability?.status === 'live' && availabilityFreshFor(availability) === 0) {
      event.preventDefault();
      refreshAvailability();
    }
  };
  const blocked = (date: string) => availability?.blocked.some(range => date >= range.start && date < range.end) || false;
  const changeMonth = (offset: number) => { const date = new Date(`${month}T12:00:00Z`); date.setUTCMonth(date.getUTCMonth() + offset); setMonth(iso(date)); };
  const chooseDate = (date: string) => {
    if (selecting === 'arrival' || !checkIn || date <= checkIn || checkOut) { setCheckIn(date); setCheckOut(''); setSelecting('departure'); }
    else { setCheckOut(date); setSelecting('arrival'); }
  };
  const selectProperty = (slug: string) => { setProperty(slug); setGuests(value => Math.min(value, stays.find(item => item.slug === slug)!.guests)); };
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
          const unavailable = date < today || date > horizon || (busy && !departureOnly);
          const selected = date === checkIn || date === checkOut;
          const between = !!checkIn && !!checkOut && date > checkIn && date < checkOut;
          const rate = getNightlyRate(date, property);
          const text = new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
          return <button key={date} type="button" disabled={unavailable} aria-pressed={selected} aria-label={`${text}${busy && !departureOnly ? ', unavailable' : departureOnly ? ', check-out only' : ''}, ${rate} Thai baht`} className={`calendar-day ${selected ? 'selected' : ''} ${between ? 'in-range' : ''} ${busy ? 'blocked' : ''} ${date === today ? 'today' : ''} ${departureOnly ? 'departure-only' : ''}`} onClick={() => chooseDate(date)}><span>{index + 1}</span><small>{!busy || departureOnly ? `${rate / 1000}k` : '—'}</small></button>;
        })}
      </div>
    </div>;
  }

  return <div className="booking-layout">
    <div className="booking-main">
      <div className="booking-step"><span>01</span><h2>Choose your little escape</h2></div>
      <div className="stay-picker" role="group" aria-label="Choose an apartment">{stays.map(item => <button key={item.slug} className={`stay-option ${property === item.slug ? 'active' : ''}`} aria-pressed={property === item.slug} onClick={() => selectProperty(item.slug)}><img src={item.image} alt="" width="100" height="80"/><span><strong>{item.name}</strong><small>Up to {item.guests} guests</small></span><span className="radio-circle">{property === item.slug && <Check size={13}/>}</span></button>)}</div>
      <div className="booking-step"><span>02</span><h2>A date with a slower pace</h2></div>
      <div className="booking-fields"><label>Check-in<input type="date" value={checkIn} min={today} max={horizon} onChange={event => { setCheckIn(event.target.value); if (checkOut <= event.target.value) setCheckOut(''); setSelecting('departure'); if (event.target.value) setMonth(`${event.target.value.slice(0, 7)}-01`); }}/></label><label>Check-out<input type="date" value={checkOut} min={checkIn ? addDays(checkIn, 2) : today} max={horizon} onChange={event => { setCheckOut(event.target.value); setSelecting('arrival'); }}/></label><label>Guests<select value={guests} onChange={event => setGuests(Number(event.target.value))}>{Array.from({ length: stay.guests }, (_, index) => <option value={index + 1} key={index}>{index + 1} guest{index > 0 ? 's' : ''}</option>)}</select></label></div>
      <div className="calendar-status" aria-live="polite">{loading ? <><LoaderCircle size={15} className="spin"/> Checking the Airbnb calendars…</> : availability?.status === 'live' ? <><span className="status-dot"/> Calendar checked {new Date(availability.checkedAt!).toLocaleTimeString('en-US', { timeZone: 'Asia/Bangkok', hour: 'numeric', minute: '2-digit' })} · Phuket time</> : <><Info size={15}/> Calendar temporarily unavailable. You can still request dates.</>}</div>
      <div className="calendar-shell" aria-label="Availability calendar" aria-busy={loading}>
        <div className="calendar-toolbar"><p>{selecting === 'departure' && checkIn && !checkOut ? 'Now choose your departure' : 'Choose your arrival date'}</p><div><button aria-label="Previous month" disabled={month <= `${today.slice(0, 7)}-01`} onClick={() => changeMonth(-1)}><ArrowLeft size={17}/></button><button aria-label="Next month" disabled={month >= `${horizon.slice(0, 7)}-01`} onClick={() => changeMonth(1)}><ArrowRight size={17}/></button></div></div>
        <div className="calendar-pair">{monthView(0)}{monthView(1)}</div>
        <div className="calendar-legend"><span><i className="legend-open"/>{availability?.status === 'live' ? 'Open on calendar' : 'Not yet verified'}</span><span><i className="legend-blocked"/>Unavailable</span><span><i className="legend-selected"/>Your dates</span><button onClick={reset}>Clear dates</button></div>
      </div>
      <p className="calendar-explainer">Prices shown are THB per night, before length-of-stay discounts. {PRICING_POLICY.minNights}-night minimum for online estimates. An open calendar is an indication; your host confirms the booking.</p>
      {result.error && <p className="booking-error" role="alert"><Info size={17}/>{result.error}</p>}
      {conflicts && <p className="booking-error" role="alert"><X size={17}/>These dates overlap an unavailable night. Try another apartment or choose different dates.</p>}
      <div className="booking-assurances"><div><ShieldCheck size={22}/><span><strong>No payment here</strong><small>Discuss the details with your host first.</small></span></div><div><MessageCircle size={22}/><span><strong>A real conversation</strong><small>Your host handles every request personally.</small></span></div></div>
    </div>
    <aside className="quote-panel" aria-label="Your stay estimate">
      <div className="quote-image"><img src={stay.image} alt={stay.name} width="540" height="400"/></div>
      <div className="quote-content"><p className="eyebrow">YOUR TIME IN RAWAI</p><h2>{stay.name}</h2><p className="quote-caption">The Title V · Rawai, Phuket</p>
        {result.quote ? <div className="price-summary" aria-live="polite"><div className="quote-row"><span>{result.quote.nights} nights · {guests} guests</span><strong>{formatTHB(result.quote.baseTotal)}</strong></div>{result.quote.discountRate > 0 && <div className="quote-row savings"><span>{result.quote.discountLabel} · {result.quote.discountRate * 100}% off</span><strong>−{formatTHB(result.quote.discountTotal)}</strong></div>}<div className="quote-total"><span>Accommodation estimate<small>THB · Thai baht</small></span><strong>{formatTHB(result.quote.total)}</strong></div><details className="nightly-details"><summary>See nightly price breakdown</summary><div>{result.quote.nightly.map(night => <p key={night.date}><span>{night.date}</span><span>{formatTHB(night.rate)}</span></p>)}</div></details></div> : <div className="empty-quote"><CalendarDays size={25}/><p>Your escape starts with a date.<br /><span>Select arrival and departure to see your estimate.</span></p></div>}
        {handoff ? <a className="button whatsapp-button" data-testid="whatsapp-request" href={handoff} target="_blank" rel="noopener noreferrer" onClick={guardHandoff} onAuxClick={guardHandoff}>{availability?.status === 'live' ? 'Request this stay' : 'Ask your host about these dates'} <ArrowUpRight size={18}/></a> : <button className="button whatsapp-button" disabled>{loading && result.quote ? 'Checking your dates…' : conflicts ? 'Choose different dates' : 'Choose your dates'} <ArrowUpRight size={18}/></button>}
        <p className="quote-disclaimer">Opens WhatsApp with your request. Nothing is sent automatically, and no payment is taken.</p>
        <div className="quote-note"><Info size={16}/><p>Accommodation estimate only. Your host confirms the final total, utility and cleaning charges, deposits, payment and cancellation terms before you book.</p></div>
        <p className="discount-hint">Stay 7+ nights, save 10%.<br/>Stay 28+ nights, save 20%.</p>
      </div>
    </aside>
  </div>;
}
