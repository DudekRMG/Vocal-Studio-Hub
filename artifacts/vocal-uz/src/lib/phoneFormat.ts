export function formatPhone(digits: string): string {
  if (!digits) return "";

  if (digits.startsWith("998")) {
    const rest = digits.slice(3);
    let r = "+998";
    if (rest.length > 0) r += " (" + rest.slice(0, Math.min(2, rest.length));
    if (rest.length >= 2) r += ")";
    if (rest.length > 2) r += " " + rest.slice(2, Math.min(5, rest.length));
    if (rest.length > 5) r += "-" + rest.slice(5, Math.min(7, rest.length));
    if (rest.length > 7) r += "-" + rest.slice(7, Math.min(9, rest.length));
    return r;
  }

  if (digits.startsWith("380")) {
    const rest = digits.slice(3);
    let r = "+380";
    if (rest.length > 0) r += " (" + rest.slice(0, Math.min(2, rest.length));
    if (rest.length >= 2) r += ")";
    if (rest.length > 2) r += " " + rest.slice(2, Math.min(5, rest.length));
    if (rest.length > 5) r += "-" + rest.slice(5, Math.min(7, rest.length));
    if (rest.length > 7) r += "-" + rest.slice(7, Math.min(9, rest.length));
    return r;
  }

  if (digits.startsWith("7")) {
    const rest = digits.slice(1);
    let r = "+7";
    if (rest.length > 0) r += " (" + rest.slice(0, Math.min(3, rest.length));
    if (rest.length >= 3) r += ")";
    if (rest.length > 3) r += " " + rest.slice(3, Math.min(6, rest.length));
    if (rest.length > 6) r += "-" + rest.slice(6, Math.min(8, rest.length));
    if (rest.length > 8) r += "-" + rest.slice(8, Math.min(10, rest.length));
    return r;
  }

  if (digits.startsWith("1")) {
    const rest = digits.slice(1);
    let r = "+1";
    if (rest.length > 0) r += " (" + rest.slice(0, Math.min(3, rest.length));
    if (rest.length >= 3) r += ")";
    if (rest.length > 3) r += " " + rest.slice(3, Math.min(6, rest.length));
    if (rest.length > 6) r += "-" + rest.slice(6, Math.min(10, rest.length));
    return r;
  }

  const ccLen = Math.min(3, digits.length);
  let r = "+" + digits.slice(0, ccLen);
  let rem = digits.slice(ccLen);
  while (rem.length > 0) {
    r += " " + rem.slice(0, 3);
    rem = rem.slice(3);
  }
  return r;
}
