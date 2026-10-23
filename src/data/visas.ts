// Ordinary-passport rules reviewed on 2026-10-23. See docs/visa-sources.md.
// The 2024 list of 93 / 60-day exemptions is superseded from 2026-09-15.
export const visaCheckedOn = '23 October 2026';
export const visaSources = {
  entry: 'https://consular.mfa.go.th/th/content/1-9-69-00',
  entryEnglish: 'https://thaiconsulatela.thaiembassy.org/en/publicservice/visa-exemption-and-visa-on-arrival-to-thailand',
  exemption: 'https://washingtondc.thaiembassy.org/en/page/visaexempt-voajul2024',
  evisa: 'https://www.thaievisa.go.th/',
  tourist: 'https://oslo.thaiembassy.org/en/page/validity-of-visa',
  dtv: 'https://london.thaiembassy.org/en/page/destination-thailand-visa',
  dtvResidence: 'https://vientiane.thaiembassy.org/en/publicservice/applying-for-a-visa',
  dtvUpdate: 'https://moscow.thaiembassy.org/en/publicservice/adjustment-to-supporting-documents-for-destination-thailand-visa-dtv-a',
  tdac: 'https://tdac.immigration.go.th/',
  tdacGuide: 'https://tdac.immigration.go.th/manual/en/',
  china: 'https://mfa.go.th/en/content/thcn280124',
} as const;

export const tourismExemption30 = new Set('AU AT BH BE BG BT BN CA HR CY CZ DK EE FJ FI FR GE DE GR HU IS ID IN IE IL IT JP JO KW KG LV LI LT LU MT MY MV NL NZ NO OM PH PL PT QA RO SA SG SK SI ZA ES SE CH TW TR UA AE GB US'.split(' '));
export const tourismExemption15 = new Set(['MU', 'SC']);
export const bilateralExemption14 = new Set(['KH', 'MM']);
export const bilateralExemption30 = new Set(['CN', 'HK', 'KZ', 'LA', 'MO', 'MN', 'RU', 'TL', 'VN']);
export const bilateralExemption90 = new Set(['AR', 'BR', 'CL', 'PE', 'KR']);
export const visaOnArrival15 = new Set(['AZ', 'BY', 'RS']);

export interface VisaCountry { code: string; name: string }

// 193 UN members, the Holy See and Palestine, plus the separate passport
// selections Hong Kong SAR, Macao SAR, Taiwan and Kosovo. A separate UI option
// handles other documents without guessing from a territory of residence.
export const visaCountries: VisaCountry[] = [
  ['AF', 'Afghanistan'], ['AL', 'Albania'], ['DZ', 'Algeria'], ['AD', 'Andorra'],
  ['AO', 'Angola'], ['AG', 'Antigua and Barbuda'], ['AR', 'Argentina'], ['AM', 'Armenia'],
  ['AU', 'Australia'], ['AT', 'Austria'], ['AZ', 'Azerbaijan'], ['BS', 'Bahamas'],
  ['BH', 'Bahrain'], ['BD', 'Bangladesh'], ['BB', 'Barbados'], ['BY', 'Belarus'],
  ['BE', 'Belgium'], ['BZ', 'Belize'], ['BJ', 'Benin'], ['BT', 'Bhutan'],
  ['BO', 'Bolivia'], ['BA', 'Bosnia and Herzegovina'], ['BW', 'Botswana'], ['BR', 'Brazil'],
  ['BN', 'Brunei'], ['BG', 'Bulgaria'], ['BF', 'Burkina Faso'], ['BI', 'Burundi'],
  ['CV', 'Cabo Verde'], ['KH', 'Cambodia'], ['CM', 'Cameroon'], ['CA', 'Canada'],
  ['CF', 'Central African Republic'], ['TD', 'Chad'], ['CL', 'Chile'], ['CN', 'China (ordinary PRC passport)'],
  ['CO', 'Colombia'], ['KM', 'Comoros'], ['CG', 'Congo (Republic)'], ['CD', 'Congo (Democratic Republic)'],
  ['CR', 'Costa Rica'], ['CI', 'Côte d’Ivoire'], ['HR', 'Croatia'], ['CU', 'Cuba'],
  ['CY', 'Cyprus'], ['CZ', 'Czechia'], ['DK', 'Denmark'], ['DJ', 'Djibouti'],
  ['DM', 'Dominica'], ['DO', 'Dominican Republic'], ['EC', 'Ecuador'], ['EG', 'Egypt'],
  ['SV', 'El Salvador'], ['GQ', 'Equatorial Guinea'], ['ER', 'Eritrea'], ['EE', 'Estonia'],
  ['SZ', 'Eswatini'], ['ET', 'Ethiopia'], ['FJ', 'Fiji'], ['FI', 'Finland'],
  ['FR', 'France'], ['GA', 'Gabon'], ['GM', 'Gambia'], ['GE', 'Georgia'],
  ['DE', 'Germany'], ['GH', 'Ghana'], ['GR', 'Greece'], ['GD', 'Grenada'],
  ['GT', 'Guatemala'], ['GN', 'Guinea'], ['GW', 'Guinea-Bissau'], ['GY', 'Guyana'],
  ['HT', 'Haiti'], ['HN', 'Honduras'], ['HK', 'Hong Kong (SAR passport)'], ['HU', 'Hungary'],
  ['IS', 'Iceland'], ['IN', 'India'], ['ID', 'Indonesia'], ['IR', 'Iran'],
  ['IQ', 'Iraq'], ['IE', 'Ireland'], ['IL', 'Israel'], ['IT', 'Italy'],
  ['JM', 'Jamaica'], ['JP', 'Japan'], ['JO', 'Jordan'], ['KZ', 'Kazakhstan'],
  ['KE', 'Kenya'], ['KI', 'Kiribati'], ['XK', 'Kosovo'], ['KW', 'Kuwait'],
  ['KG', 'Kyrgyzstan'], ['LA', 'Laos'], ['LV', 'Latvia'], ['LB', 'Lebanon'],
  ['LS', 'Lesotho'], ['LR', 'Liberia'], ['LY', 'Libya'], ['LI', 'Liechtenstein'],
  ['LT', 'Lithuania'], ['LU', 'Luxembourg'], ['MO', 'Macao (SAR passport)'], ['MG', 'Madagascar'],
  ['MW', 'Malawi'], ['MY', 'Malaysia'], ['MV', 'Maldives'], ['ML', 'Mali'],
  ['MT', 'Malta'], ['MH', 'Marshall Islands'], ['MR', 'Mauritania'], ['MU', 'Mauritius'],
  ['MX', 'Mexico'], ['FM', 'Micronesia'], ['MD', 'Moldova'], ['MC', 'Monaco'],
  ['MN', 'Mongolia'], ['ME', 'Montenegro'], ['MA', 'Morocco'], ['MZ', 'Mozambique'],
  ['MM', 'Myanmar'], ['NA', 'Namibia'], ['NR', 'Nauru'], ['NP', 'Nepal'],
  ['NL', 'Netherlands'], ['NZ', 'New Zealand'], ['NI', 'Nicaragua'], ['NE', 'Niger'],
  ['NG', 'Nigeria'], ['KP', 'North Korea'], ['MK', 'North Macedonia'], ['NO', 'Norway'],
  ['OM', 'Oman'], ['PK', 'Pakistan'], ['PW', 'Palau'], ['PS', 'Palestine'],
  ['PA', 'Panama'], ['PG', 'Papua New Guinea'], ['PY', 'Paraguay'], ['PE', 'Peru'],
  ['PH', 'Philippines'], ['PL', 'Poland'], ['PT', 'Portugal'], ['QA', 'Qatar'],
  ['RO', 'Romania'], ['RU', 'Russia'], ['RW', 'Rwanda'], ['KN', 'Saint Kitts and Nevis'],
  ['LC', 'Saint Lucia'], ['VC', 'Saint Vincent and the Grenadines'], ['WS', 'Samoa'], ['SM', 'San Marino'],
  ['ST', 'São Tomé and Príncipe'], ['SA', 'Saudi Arabia'], ['SN', 'Senegal'], ['RS', 'Serbia'],
  ['SC', 'Seychelles'], ['SL', 'Sierra Leone'], ['SG', 'Singapore'], ['SK', 'Slovakia'],
  ['SI', 'Slovenia'], ['SB', 'Solomon Islands'], ['SO', 'Somalia'], ['ZA', 'South Africa'],
  ['KR', 'South Korea (Republic of Korea)'], ['SS', 'South Sudan'], ['ES', 'Spain'], ['LK', 'Sri Lanka'],
  ['SD', 'Sudan'], ['SR', 'Suriname'], ['SE', 'Sweden'], ['CH', 'Switzerland'],
  ['SY', 'Syria'], ['TW', 'Taiwan'], ['TJ', 'Tajikistan'], ['TZ', 'Tanzania'],
  ['TH', 'Thailand'], ['TL', 'Timor-Leste'], ['TG', 'Togo'], ['TO', 'Tonga'],
  ['TT', 'Trinidad and Tobago'], ['TN', 'Tunisia'], ['TR', 'Türkiye'], ['TM', 'Turkmenistan'],
  ['TV', 'Tuvalu'], ['UG', 'Uganda'], ['UA', 'Ukraine'], ['AE', 'United Arab Emirates'],
  ['GB', 'United Kingdom (British citizen)'], ['US', 'United States'], ['UY', 'Uruguay'], ['UZ', 'Uzbekistan'],
  ['VU', 'Vanuatu'], ['VA', 'Vatican City (Holy See)'], ['VE', 'Venezuela'], ['VN', 'Vietnam'],
  ['YE', 'Yemen'], ['ZM', 'Zambia'], ['ZW', 'Zimbabwe'],
].map(([code, name]) => ({ code, name }));

const popularCodes = ['RU', 'GB', 'DE', 'AU', 'IN', 'CN', 'US', 'FR', 'CA', 'KZ'];
export const popularVisaCountries = popularCodes.map(code => visaCountries.find(country => country.code === code)!);
export const otherVisaCountries = visaCountries.filter(country => !popularCodes.includes(country.code)).sort((a, b) => a.name.localeCompare(b.name, 'en'));
