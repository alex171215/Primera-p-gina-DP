// ===== Utilidades ES6+ compartidas =====
// Selección rápida de nodos (querySelector)
export const $ = (sel, root = document) => root.querySelector(sel);
// Selección múltiple convertida a array
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
// Sleep: promesa que resuelve tras 'ms' (útil en mocks/demos)
export const sleep = (ms = 700) => new Promise(res => setTimeout(res, ms));
// Pinta estado textual en la UI (cargando/ok/error)
export const renderStatus = (msg = "", type = "") => {
 const el = $("#status");
 if (!el) return;
 el.textContent = msg;
 el.className = `status ${type}`.trim();
};
// Renderiza la lista de usuarios
export const renderUsers = (users = []) => {
 const list = $("#users");
 list.innerHTML = users
 .map(u => `<li><strong>${u.name}</strong> · <small>${u.email}</small></li>`)
 .join("");
};
// Limpia listado
export const clearUsers = () => { const list = $("#users"); if (list) list.innerHTML =
""; };
// Log minimalista con timestamp e indicador de tipo
export const log = (message, kind = "info") => {
 const area = $("#logs");
 const stamp = new Date().toISOString();
 const tag = kind.toUpperCase().padEnd(5);
 area.textContent += `[${stamp}] ${tag} ${message}\n`;
 area.scrollTop = area.scrollHeight; // auto-scroll
};
// Error de aplicación con metadatos (para enriquecer manejo de errores)
export class AppError extends Error {
 constructor(message, meta = {}) {
 super(message);
 this.name = "AppError";
 this.meta = meta; // ej: {status, url, code, cause}
 }
}
