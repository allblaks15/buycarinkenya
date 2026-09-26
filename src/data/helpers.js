// Shared helpers for the vehicle catalogue files.
// V(name, engineCC, fuel, horsepower, transmission, drive, economy, priceLowKESm, priceHighKESm, whatThisTrimAdds)
export const V = (name, cc, fuel, hp, trans, drive, economy, lo, hi, note = '') => ({ name, cc, fuel, hp, trans, drive, economy, price: [lo, hi], note });
export const J = ['Japan'], U = ['UK'], JU = ['Japan', 'UK'], UJ = ['UK', 'Japan'], SA = ['South Africa'], ALL = ['Japan', 'UK', 'South Africa'], SU = ['South Africa', 'UK'], JSA = ['Japan', 'South Africa'];
export const slugify = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[()]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
