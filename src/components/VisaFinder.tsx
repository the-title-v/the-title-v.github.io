import { useState } from 'react';
import { popularVisaCountries, otherVisaCountries, visaCountries, visaSources } from '../data/visas';
import { getVisaAdvice } from '../lib/visas';

export default function VisaFinder({ initialCountry = '' }: { initialCountry?: string }) {
  const [country, setCountry] = useState(initialCountry);
  const advice = getVisaAdvice(country);
  const countryName = visaCountries.find(item => item.code === country)?.name;
  const showApplications = !['thai', 'check'].includes(advice.kind);
  const showTourist = !(advice.kind === 'visa-exempt' && advice.days === 90);

  return <div className="visa-finder">
    <section className="visa-selector" aria-labelledby="visa-selector-title">
      <div>
        <p className="eyebrow">START WITH YOUR PASSPORT</p>
        <h2 id="visa-selector-title">Find your entry route.</h2>
        <p>Choose the passport you will use to enter Thailand.</p>
      </div>
      <div className="visa-select-field">
        <label htmlFor="visa-passport">Citizenship / passport country</label>
        <select id="visa-passport" value={country} onChange={event => setCountry(event.target.value)} aria-describedby="visa-passport-help">
          <option value="">Select your passport</option>
          <optgroup label="Popular choices">
            {popularVisaCountries.map(item => <option key={item.code} value={item.code}>{item.name}</option>)}
          </optgroup>
          <optgroup label="All other countries & passports">
            {otherVisaCountries.map(item => <option key={item.code} value={item.code}>{item.name}</option>)}
          </optgroup>
          <option value="OTHER">Other passport / travel document</option>
        </select>
        <p id="visa-passport-help">For ordinary passports and holiday travel. If you have two citizenships, choose the passport you will travel on.</p>
      </div>
    </section>

    <div className="visa-result" aria-live="polite" aria-atomic="true">
      {advice.kind === 'unselected' && <p className="visa-empty">Choose your passport to see your short-visit route, then explore the longer-stay options below.</p>}
      {advice.kind === 'visa-exempt' && <article className="visa-primary">
        <div className="visa-primary-title">
          <p className="eyebrow">{countryName} · NO VISA APPLICATION</p>
          <h3>Up to {advice.days} days, visa-free.</h3>
          <p>{advice.basis === 'bilateral' ? 'Your ordinary passport is covered by a bilateral visa-exemption agreement.' : 'Your ordinary passport is on Thailand’s visa-exemption list for tourism.'} No visa fee or advance visa application is needed for a qualifying visit.</p>
        </div>
        <div className="visa-primary-next">
          <p className="visa-small-heading">Before you fly</p>
          <p>Check your passport validity and prepare your onward or return travel, accommodation details and proof of funds. Complete the <a href="#tdac">TDAC arrival form</a> shortly before arrival.</p>
          <a className="text-link" href={visaSources.entryEnglish} target="_blank" rel="noopener noreferrer">Official passport list <span aria-hidden="true">↗</span></a>
        </div>
        {advice.notes.length > 0 && <div className="visa-country-notes">{advice.notes.map(note => <p key={note}>{note}</p>)}</div>}
        {advice.basis === 'tourism-scheme' && advice.days === 30 && <details className="visa-extension">
          <summary>Can I stay a little longer?</summary>
          <p>You may request an extension of up to 30 days from Thai Immigration. Approval is discretionary; arrange the right visa in advance if your travel plans depend on a longer stay. <a href={visaSources.exemption} target="_blank" rel="noopener noreferrer">Official extension guidance ↗</a></p>
        </details>}
      </article>}
      {advice.kind === 'visa-on-arrival' && <article className="visa-primary">
        <div className="visa-primary-title">
          <p className="eyebrow">{countryName} · APPLY AT ARRIVAL</p>
          <h3>Visa on Arrival · up to 15 days.</h3>
          <p>Your ordinary passport is on the Visa on Arrival list. Apply at a designated immigration checkpoint and pay the ฿2,000 visa fee.</p>
        </div>
        <div className="visa-primary-next">
          <p className="visa-small-heading">Come prepared</p>
          <p>Bring the application documents, passport photo, accommodation details, proof of funds and a confirmed departure ticket within 15 days. For a longer holiday, apply for a Tourist Visa before you fly.</p>
          <a className="text-link" href={visaSources.entryEnglish} target="_blank" rel="noopener noreferrer">Official Visa on Arrival list <span aria-hidden="true">↗</span></a>
        </div>
      </article>}
      {advice.kind === 'visa-required' && <article className="visa-primary">
        <div className="visa-primary-title">
          <p className="eyebrow">{countryName} · PLAN AHEAD</p>
          <h3>Apply before you travel.</h3>
          <p>This ordinary passport is not on the current visa-exemption or Visa on Arrival lists. For a holiday, start with a Tourist Visa application.</p>
        </div>
        <div className="visa-primary-next">
          <p className="visa-small-heading">Your next step</p>
          <p>Check Thai e-Visa using your passport and current location. The responsible Thai embassy sets the documents, fee and processing time. Wait for approval before travelling.</p>
          <a className="text-link" href={visaSources.evisa} target="_blank" rel="noopener noreferrer">Open Thai e-Visa <span aria-hidden="true">↗</span></a>
        </div>
      </article>}
      {advice.kind === 'check' && <article className="visa-primary visa-primary-single">
        <p className="eyebrow">A QUICK EMBASSY CHECK</p>
        <h3>Check your travel document.</h3>
        <p>Emergency, refugee, stateless and other travel documents can have different rules. This also applies to British nationality categories other than British citizen. Ask the responsible Thai embassy to confirm your route before booking travel.</p>
        <a className="text-link" href={visaSources.evisa} target="_blank" rel="noopener noreferrer">Check with Thai e-Visa <span aria-hidden="true">↗</span></a>
      </article>}
      {advice.kind === 'thai' && <article className="visa-primary visa-primary-single">
        <p className="eyebrow">WELCOME HOME</p>
        <h3>Travelling on a Thai passport.</h3>
        <p>The foreign-visitor visa routes on this page do not apply when you enter on your Thai passport. The TDAC form is for non-Thai nationals.</p>
      </article>}
    </div>

    {showApplications && <section className="visa-longer" aria-labelledby="visa-longer-title">
      <div className="visa-longer-heading">
        <p className="eyebrow">A LITTLE MORE TIME IN THAILAND</p>
        <h2 id="visa-longer-title">Make room for a longer stay.</h2>
        <p>Choose a visa that fits your plans. These routes need an application and approval before travel.</p>
      </div>
      <div className={`visa-options${showTourist ? '' : ' visa-options-single'}`}>
        {showTourist && <article className="visa-option">
          <p className="visa-option-duration">UP TO 60 DAYS PER ENTRY</p>
          <h3>Tourist Visa <span>(TR)</span></h3>
          <p>A holiday with more time to settle in. Apply in advance through Thai e-Visa from outside Thailand.</p>
          <details>
            <summary>How to prepare</summary>
            <div className="visa-option-detail">
              <p>Use your passport and current location to find the responsible embassy. Prepare your passport, photo, travel and accommodation plans, and financial evidence, following its checklist.</p>
              <p>Submit the form, upload the documents, pay the visa fee and wait for approval. Fees and processing times depend on the embassy.</p>
              <p>For repeated visits, check the multiple-entry Tourist Visa with your embassy. Its validity and each permitted stay are separate limits.</p>
            </div>
          </details>
          <div className="visa-option-links"><a className="text-link" href={visaSources.evisa} target="_blank" rel="noopener noreferrer">Apply for a Tourist Visa <span aria-hidden="true">↗</span></a><a href={visaSources.tourist} target="_blank" rel="noopener noreferrer">Official stay lengths ↗</a></div>
        </article>}
        <article className="visa-option" id="dtv">
          <p className="visa-option-duration">UP TO 180 DAYS PER ENTRY</p>
          <h3>Destination Thailand Visa <span>(DTV)</span></h3>
          <p>For qualifying remote workers or freelancers, participants in activities such as Muay Thai, Thai cooking or medical treatment, and eligible family members.</p>
          <p className="visa-eligibility-note">Citizenship alone does not establish eligibility.</p>
          <details>
            <summary>Who it suits & what you need</summary>
            <div className="visa-option-detail">
              <ul>
                <li>Evidence of qualifying overseas work or a professional portfolio, confirmed activity or treatment, or your relationship to a DTV holder. The family route covers a spouse or children under 20.</li>
                <li>Financial evidence of at least ฿500,000, with the documents and statement history your embassy requests.</li>
                <li>Proof of permanent residence and a certificate of criminal record clearance, required for new applications from 31 August 2026. Confirm the exact documents with your mission.</li>
              </ul>
              <p>Apply outside Thailand in a country where you are a citizen or permanent resident. Follow that embassy’s checklist and submit through Thai e-Visa.</p>
              <p>The visa has five-year validity and multiple entries. Each entry allows up to 180 days; a further extension of up to 180 days per entry may be requested from Thai Immigration.</p>
              <a href={visaSources.dtvResidence} target="_blank" rel="noopener noreferrer">Where to apply & the 2026 update ↗</a>
            </div>
          </details>
          <div className="visa-option-links"><a className="text-link" href={visaSources.dtv} target="_blank" rel="noopener noreferrer">Official DTV requirements <span aria-hidden="true">↗</span></a><a href={visaSources.evisa} target="_blank" rel="noopener noreferrer">Start at Thai e-Visa ↗</a></div>
        </article>
      </div>
      <p className="visa-other-routes">Coming for retirement, study, family or a job in Thailand? <a href={visaSources.evisa} target="_blank" rel="noopener noreferrer">Explore the other official visa categories ↗</a></p>
    </section>}
  </div>;
}
