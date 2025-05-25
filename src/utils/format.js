// src/utils/format.js
export function parsePrice(priceStr) {
  // "2600€" → 2600
  return parseFloat(priceStr.replace('€', '')) || 0;
}
