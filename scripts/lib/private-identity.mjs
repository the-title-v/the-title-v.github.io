// Actual matching terms belong only in ignored local configuration.
export function loadPrivateIdentityTerms(value = process.env.PRIVATE_IDENTITY_TERMS_JSON) {
  let terms;
  try { terms = JSON.parse(value ?? ''); } catch { /* Report configuration without echoing it. */ }
  if (!Array.isArray(terms) || !terms.length || terms.some(term => typeof term !== 'string' || !term.trim())) {
    throw new Error('PRIVATE_IDENTITY_TERMS_JSON must contain a nonempty JSON array of private matching terms');
  }
  return terms.map(term => term.trim());
}

export function createPrivateIdentityCheck(terms = loadPrivateIdentityTerms()) {
  const patterns = terms.map(term => {
    const escaped = term.normalize('NFKC').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'iu');
  });
  return (value, context) => {
    const text = String(value)
      .replace(/(?:%[0-9a-f]{2})+/gi, encoded => {
        try { return decodeURIComponent(encoded); } catch { return encoded; }
      })
      .replace(/\\u([0-9a-f]{4})/gi, (_, hex) => String.fromCharCode(Number.parseInt(hex, 16)))
      .replace(/\\[bB]/g, ' ')
      .normalize('NFKC');
    if (patterns.some(pattern => pattern.test(text))) {
      throw new Error(`Private identity found in ${context}`);
    }
  };
}
