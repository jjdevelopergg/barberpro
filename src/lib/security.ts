// ===== SECURITY MODULE =====
// Proteções: criptografia, sanitização, rate limiting, validação

// --- Criptografia simples para localStorage ---
const ENCRYPTION_KEY = "bp-sec-2026";

export function encrypt(data: string): string {
  try {
    const encoded = btoa(encodeURIComponent(data));
    // XOR com chave
    let result = "";
    for (let i = 0; i < encoded.length; i++) {
      result += String.fromCharCode(
        encoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
      );
    }
    return btoa(result);
  } catch {
    return btoa(data);
  }
}

export function decrypt(data: string): string {
  try {
    const decoded = atob(data);
    let result = "";
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(
        decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
      );
    }
    return decodeURIComponent(atob(result));
  } catch {
    try { return atob(data); } catch { return data; }
  }
}

// --- Secure Storage (localStorage com criptografia) ---
export const secureStorage = {
  set(key: string, value: unknown): void {
    try {
      const json = JSON.stringify(value);
      const encrypted = encrypt(json);
      localStorage.setItem(key, encrypted);
    } catch { /* silent fail */ }
  },

  get<T>(key: string): T | null {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      const decrypted = decrypt(encrypted);
      return JSON.parse(decrypted) as T;
    } catch {
      // Se falhar decrypt, tenta ler direto (migração de dados antigos)
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        return JSON.parse(raw) as T;
      } catch { return null; }
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  }
};

// --- Rate Limiting ---
const loginAttempts: Record<string, { count: number; lastAttempt: number; blocked: boolean }> = {};

export function checkRateLimit(email: string): { allowed: boolean; waitSeconds: number } {
  const now = Date.now();
  const key = email.toLowerCase();

  if (!loginAttempts[key]) {
    loginAttempts[key] = { count: 0, lastAttempt: now, blocked: false };
  }

  const attempt = loginAttempts[key];

  // Reset after 15 minutes
  if (now - attempt.lastAttempt > 15 * 60 * 1000) {
    attempt.count = 0;
    attempt.blocked = false;
  }

  // Block after 5 failed attempts
  if (attempt.count >= 5) {
    const waitTime = 15 * 60 * 1000 - (now - attempt.lastAttempt);
    if (waitTime > 0) {
      return { allowed: false, waitSeconds: Math.ceil(waitTime / 1000) };
    }
    attempt.count = 0;
    attempt.blocked = false;
  }

  return { allowed: true, waitSeconds: 0 };
}

export function recordFailedLogin(email: string): void {
  const key = email.toLowerCase();
  if (!loginAttempts[key]) {
    loginAttempts[key] = { count: 0, lastAttempt: Date.now(), blocked: false };
  }
  loginAttempts[key].count++;
  loginAttempts[key].lastAttempt = Date.now();
}

export function resetLoginAttempts(email: string): void {
  const key = email.toLowerCase();
  delete loginAttempts[key];
}

// --- Input Sanitization ---
export function sanitize(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim().slice(0, 254);
}

export function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, "").trim().slice(0, 100);
}

// --- Password Validation ---
export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 6) return { valid: false, message: "Mínimo 6 caracteres." };
  if (password.length > 128) return { valid: false, message: "Máximo 128 caracteres." };
  return { valid: true, message: "" };
}

// --- Email Validation ---
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) && email.length <= 254;
}

// --- Session Token ---
export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

// --- CSRF-like protection ---
export function generateCSRFToken(): string {
  const token = generateSessionToken();
  sessionStorage.setItem("csrf-token", token);
  return token;
}

export function validateCSRFToken(token: string): boolean {
  return token === sessionStorage.getItem("csrf-token");
}
