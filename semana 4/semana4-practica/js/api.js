// ===== Capa de datos: Fetch + async/await + manejo de errores =====
import { AppError, log, sleep } from "./utils.js";
// URL remota (demo pública)
const REMOTE_URL = "https://jsonplaceholder.typicode.com/users";
// Fallback local para offline/demo controlada
const MOCK_URL = "./js/mock/users.json";
// Carga usuarios desde API o mock.
// forceError=true simula una falla controlada para probar manejo de errores.
export async function loadUsers({ useMock = false, forceError = false } = {}) {
 if (forceError) {
 await sleep(500); // simula tiempo de red
 throw new AppError("Fallo simulado en la carga", { code: "FORCED_ERROR" });
 }
 const url = useMock ? MOCK_URL : REMOTE_URL;
 try {
 // Petición HTTP (acepta JSON)
 const res = await fetch(url, { headers: { "Accept": "application/json" } });
 // Si el servidor responde con error (4xx/5xx), lanzamos AppError
 if (!res.ok) {
 throw new AppError(`HTTP ${res.status}`, { status: res.status, url });
 }
 // Intento de parseo JSON (también podría fallar si el body no es JSON)
 const data = await res.json();
 // Normalización de estructura (garantiza name/email)
 const users = data.map(u => ({
 id: u.id,
 name: u.name ?? `${u.firstName ?? "N"} ${u.lastName ?? ""}`.trim(),
 email: u.email ?? "no-email@example.com",
 }));
 return users;
 } catch (err) {
 // Si no es AppError, lo envolvemos para unificar manejo arriba
 if (!(err instanceof AppError)) {
 throw new AppError(err.message || "Error desconocido al cargar usuarios", { cause:
err });
 }
 // Si ya era AppError, lo propagamos tal cual
 throw err;
 }
}