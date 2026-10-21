export function isRequired(value) {
  if (value === null || value === undefined) return false;
  return String(value).trim().length > 0;
}

export function isValidEmail(email) {
  if (typeof email !== "string") return false;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidSouthAfricanPhone(phone) {
  if (typeof phone !== "string") return false;

  const normalized = phone.replace(/[\s()-]/g, "");

  return /^(?:(?:\+27|27|0)[1-9]\d{8})$/.test(normalized);
}

export function isValidPassword(password) {
  if (typeof password !== "string") return false;

  return password.length >= 8;
}

export function passwordsMatch(password, confirmation) {
  return (
    typeof password === "string" &&
    typeof confirmation === "string" &&
    password === confirmation
  );
}

export function isValidUrl(value) {
  if (typeof value !== "string" || !value.trim()) return false;

  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidDate(value) {
  if (!value) return false;

  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

export function isValidPositiveNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return false;
  }

  const number = Number(value);
  return Number.isFinite(number) && number > 0;
}