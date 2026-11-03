/* La Pegada — Cuenta de miembros
   API_BASE: ÚNICO lugar donde se configura la URL del backend.
   Producción (Fase 2): https://lapegada-backend.onrender.com
   (window.LA_PEGADA_API permite sobrescribirla en desarrollo local). */
const API_BASE = (window.LA_PEGADA_API || 'https://lapegada-backend.onrender.com') + '/api';

const RENGLON_NOMBRES = {
  gana_mas_nacional: 'Gana Más + Nacional',
  leidsa_real: 'Leidsa + Real',
  nuevayork: 'Nueva York Tarde y Noche',
  florida: 'Florida Tarde y Noche',
  loteka: 'Loteka',
};

// Preferencias de "lotería favorita": renglones + «Todas» (solo preferencia de
// seguimiento/mensajes; el acceso del miembro activo es a todos los renglones).
const FAVORITO_NOMBRES = { todas: 'Todas las loterías', ...RENGLON_NOMBRES };

const ESTADO_TEXTO = {
  sin_pago: 'Sin pago todavía',
  pendiente_voucher: 'Voucher en revisión',
  activo: 'Activo ✅',
  vencido: 'Vencido',
};

function token() { return localStorage.getItem('lp_token') || ''; }
function guardarToken(t) { localStorage.setItem('lp_token', t); }
function cerrarSesion() { localStorage.removeItem('lp_token'); location.href = 'entrar.html'; }

async function api(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (token()) headers.Authorization = 'Bearer ' + token();
  const resp = await fetch(API_BASE + path, { ...opts, headers });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(data.error || ('Error ' + resp.status));
  return data;
}

function mostrarError(el, err) {
  el.textContent = err.message || String(err);
  el.style.display = 'block';
}

function precioTexto(plan) {
  return (plan.moneda === 'USD' ? 'US$' : 'RD$') + plan.precio.toLocaleString('es-DO');
}

function fechaCorta(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' });
}
