// Autenticação simples do responsável por PIN de 4 dígitos.
// O PIN nunca é guardado em texto puro — só o hash (SHA-256) fica salvo.
// Isso é adequado pra impedir que a criança/adolescente entre sem querer
// na área do responsável — não é proteção contra alguém tecnicamente
// capaz de inspecionar o dispositivo. Pra isso, no futuro, o ideal é
// validar o PIN num servidor, não só no navegador.

const PIN_HASH_KEY = 'nantea_guardian_pin_hash';
const UNLOCKED_KEY = 'nantea_guardian_unlocked';

async function hashPin(pin) {
  const bytes = new TextEncoder().encode(pin);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function hasPin() {
  return !!localStorage.getItem(PIN_HASH_KEY);
}

export async function setPin(pin) {
  const hash = await hashPin(pin);
  localStorage.setItem(PIN_HASH_KEY, hash);
}

export async function verifyPin(pin) {
  const stored = localStorage.getItem(PIN_HASH_KEY);
  if (!stored) return false;
  const hash = await hashPin(pin);
  return hash === stored;
}

export function resetPin() {
  localStorage.removeItem(PIN_HASH_KEY);
  sessionStorage.removeItem(UNLOCKED_KEY);
}

// "Desbloqueado" vale só pra aba/sessão atual — fechar o navegador tranca de novo.
export function markUnlocked() {
  sessionStorage.setItem(UNLOCKED_KEY, 'true');
}

export function isUnlocked() {
  return sessionStorage.getItem(UNLOCKED_KEY) === 'true';
}
