import CurrencyControls, { CurrencyProvider, useCurrency } from './CurrencyControls';
import { FESTIVE_RATE, PRICING_POLICY, SEASONAL_RATES } from '../lib/pricing';

const periods = ['May–Sep', 'Apr & Oct', 'Mar & Nov', 'Dec–Feb*'];

function RateSheet() {
  const { money, currency } = useCurrency();
  return <div className="rates-sheet">
    <div className="rates-toolbar"><div><p className="eyebrow">MAKE YOURSELF AT HOME</p><h2>Your stay, <em>at a glance.</em></h2></div><CurrencyControls /></div>
    <div className="rates-columns">
      <section className="nightly-rates" aria-labelledby="nightly-heading">
        <h3 id="nightly-heading">Nightly rates</h3><p className="rates-caption">One apartment · 2 guests included</p>
        <table className="rate-table"><thead><tr><th scope="col">Season</th><th scope="col">Dates</th><th scope="col">{currency} / night</th></tr></thead><tbody>
          {SEASONAL_RATES.map((rate, index) => <tr key={rate.id}><th scope="row">{rate.name}</th><td>{periods[index]}</td><td>{money(rate.nightlyRate)}</td></tr>)}
          <tr className="festive-rate"><th scope="row">{FESTIVE_RATE.name}</th><td>23 Dec–12 Jan</td><td>{money(FESTIVE_RATE.nightlyRate)}</td></tr>
        </tbody></table><p className="rates-footnote">*Festive rates apply to nights from 23 December through 12 January.</p>
        <div className="stay-savings"><div><strong>10% <em>off</em></strong><span>7–27 nights</span></div><div><strong>20% <em>off</em></strong><span>28+ nights</span></div><p>Accommodation only.<br />Applied automatically.</p></div>
      </section>
      <section className="stay-fees" aria-labelledby="fees-heading">
        <h3 id="fees-heading">A few practical details</h3>
        <dl className="fee-list">
          <div><dt>Extra child<small>Beyond 2 included guests · age 14 or under</small></dt><dd>{money(PRICING_POLICY.extraGuestNightlyRate)}<small>per night</small></dd></div>
          <div><dt>Cleaning<small>Per apartment, per stay</small></dt><dd>{money(PRICING_POLICY.cleaningPerApartment)}</dd></div>
          <div><dt>Refundable deposit<small>Separate · once per booking</small></dt><dd>{money(PRICING_POLICY.shortStayDeposit)}<small>up to 30 nights</small><span>{money(PRICING_POLICY.longStayDeposit)}</span><small>31+ nights</small></dd></div>
          <div><dt>Electricity & water<small>Metered separately</small></dt><dd>{money(PRICING_POLICY.electricityPerKwh)} / kWh<small>{money(PRICING_POLICY.waterPerCubicMeter)} / m³</small></dd></div>
        </dl>
        <p className="rates-footnote">Up to 2 adults and 2 children per apartment. Booking both doubles the nightly rate and cleaning; the deposit stays the same.</p>
      </section>
    </div>
  </div>;
}

export default function CurrencyRates() {
  return <CurrencyProvider><RateSheet /></CurrencyProvider>;
}
