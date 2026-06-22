// config.js — PRODUÇÃO
// Credenciais Supabase
const SB_URL = 'https://nathaeuqbeqlvkftbmes.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdGhhZXVxYmVxbHZrZnRibWVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4OTc4MzYsImV4cCI6MjA5NTQ3MzgzNn0.9t3q5C_h1pRb11gqRtpGGVpOUGey5TBzvMgal8h6wtg';

// Fallback local — usado antes do banco carregar
const CLINICA_CONFIG = {
  nome: 'Dra. Anna Carolina Dias',
  especialidade: 'Harmonização Orofacial',
  logo: 'logo.jpg',
  cor: '#1D9E75',
  pinLength: 4,
  loginEmail: 'clinica@annacarolina.com'
};

// Carrega config do Supabase e aplica dinamicamente
async function carregarConfigClinica() {
  try {
    const res = await fetch(`${SB_URL}/rest/v1/config_clinica?select=*&limit=1`, {
      headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
    });
    const data = await res.json();
    if (data && data.length > 0) {
      const c = data[0];
      CLINICA_CONFIG.nome        = c.nome        || CLINICA_CONFIG.nome;
      CLINICA_CONFIG.especialidade = c.especialidade || CLINICA_CONFIG.especialidade;
      CLINICA_CONFIG.logo        = c.logo_url    || CLINICA_CONFIG.logo;
      CLINICA_CONFIG.cor         = c.cor_principal || CLINICA_CONFIG.cor;
      CLINICA_CONFIG.telefone    = c.telefone    || '';
      CLINICA_CONFIG.whatsapp    = c.whatsapp    || '';
      CLINICA_CONFIG.endereco    = c.endereco    || '';
      CLINICA_CONFIG.email       = c.email       || '';
      CLINICA_CONFIG.instagram   = c.instagram   || '';
      CLINICA_CONFIG._id         = c.id;

      // Aplica cor principal dinamicamente
      document.documentElement.style.setProperty('--verde', c.cor_principal || '#1D9E75');
    }
  } catch(e) { /* usa fallback */ }
}

// Login via Supabase Auth (PIN como senha)
async function authLogin(pin) {
  try {
    const res = await fetch(`${SB_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SB_KEY },
      body: JSON.stringify({ email: CLINICA_CONFIG.loginEmail, password: pin })
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      return { ok: false, error: data.error_description || 'PIN incorreto' };
    }
    const expires = Date.now() + 8 * 60 * 60 * 1000;
    localStorage.setItem('clinica_auth', JSON.stringify({
      ok: true, expires,
      access_token: data.access_token,
      refresh_token: data.refresh_token
    }));
    sessionStorage.setItem('clinica_auth', '1');
    return { ok: true };
  } catch(e) {
    return { ok: false, error: 'Erro de conexão.' };
  }
}
