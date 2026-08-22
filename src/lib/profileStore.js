// Armazenamento local do perfil, pra este protótipo rodar sem backend.
// Se vocês já têm um profileStore.js real no projeto Base44, usem o de
// vocês — este aqui existe só pra as telas terem onde salvar/ler dados
// enquanto testam.

const PROFILE_ID_KEY = 'nantea_profile_id';
const WHO_USES_KEY = 'nantea_who_uses';
const PROFILE_KEY = 'nantea_profile';
const COMPANION_KEY = 'nantea_companion';
const MOM_MESSAGE_KEY = 'nantea_mom_message';

function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getProfileId() {
  return localStorage.getItem(PROFILE_ID_KEY);
}
function ensureProfileId() {
  let id = getProfileId();
  if (!id) {
    id = 'p_' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(PROFILE_ID_KEY, id);
  }
  return id;
}

export function saveWhoUses(value) {
  ensureProfileId();
  localStorage.setItem(WHO_USES_KEY, value);
}
export function getWhoUses() {
  return localStorage.getItem(WHO_USES_KEY);
}

export function saveProfile(data) {
  ensureProfileId();
  writeJSON(PROFILE_KEY, data);
}
export function getProfile() {
  return readJSON(PROFILE_KEY);
}

export function saveCompanion(data) {
  ensureProfileId();
  writeJSON(COMPANION_KEY, data);
}
export function getCompanion() {
  return readJSON(COMPANION_KEY);
}

// Nota: recordingUrl vem de URL.createObjectURL(), que não sobrevive a um
// recarregamento de página. Pra persistir áudio de verdade entre sessões,
// isso precisa ser enviado a um servidor (ou salvo como base64 — pesado
// pra localStorage) em vez de guardado como blob URL.
export function saveMomMessage(data) {
  writeJSON(MOM_MESSAGE_KEY, data);
}
export function getMomMessage() {
  return readJSON(MOM_MESSAGE_KEY);
}
