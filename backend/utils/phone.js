export function normalizeLtPhone(raw) {
  if (!raw) return null;
  // paliekam tik skaitmenis
  let d = String(raw).replace(/\D+/g, "");

  // jei prasideda 370 -> ok
  if (d.startsWith("370")) return d;

  // jei prasideda 86... -> paversk į 3706...
  if (d.startsWith("86")) return "370" + d.slice(1);

  // jei prasideda 8... -> paversk į 370...
  if (d.startsWith("8")) return "370" + d.slice(1);

  // jei prasideda 06... -> paversk į 3706...
  if (d.startsWith("06")) return "370" + d.slice(1);

  // jei prasideda 6... (be nulio ir be šalies kodo) -> pridėk 370
  if (d.startsWith("6")) return "370" + d;

  // jei prasideda 0... -> pakeisk 0 į 370
  if (d.startsWith("0")) return "370" + d.slice(1);

  // jei jau tarptautinis be + (pvz. 371...), paliekam kaip yra
  return d;
}

export function isLikelyMobileLt(d) {
  return /^3706\d{7}$/.test(d); // LT mobilus: 3706 + 7 sk.
}
