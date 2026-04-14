// ===== Punto de entrada de la app (módulo) =====
import { $, log, renderStatus, renderUsers, clearUsers } from "./utils.js";
import { validateForm } from "./validation.js";
import { loadUsers } from "./api.js";
// Cache de nodos de UI
const form = $("#user-form");
const formFeedback = $("#form-feedback");
const btnLoad = $("#btn-load");
const btnLoadError = $("#btn-load-error");
const useMockToggle = $("#use-mock");
// --- Helpers de UI para mostrar errores por campo ---
function setFieldError(name, message = "") {
 // El <small> destinatario del mensaje:
 const el = $(`[data-error-for="${name}"]`);
 if (el) el.textContent = message;
 // Atributo aria-invalid para accesibilidad
 const input = $(`#${name}`);
 if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
}
function clearFormErrors() {
 ["name", "email"].forEach(n => setFieldError(n, ""));
 formFeedback.textContent = "";
 formFeedback.className = "feedback";
}
function setFormFeedback(msg, type = "ok") {
 formFeedback.textContent = msg;
 formFeedback.className = `feedback ${type}`;
}
// --- A. Validación del formulario (cliente, sin envío real) ---
form.addEventListener("submit", e => {
 e.preventDefault(); // Evita recarga/navegación
 clearFormErrors();
 // Recogemos datos de inputs
 const data = {
 name: $("#name").value,
 email: $("#email").value
 };
 try {
 // Valida y lanza AppError si encuentra errores
 validateForm(data);
 // Si no lanzó, todo OK
 setFormFeedback(" Datos válidos. (Simulación: listos para enviar)", "ok");
 log(`Formulario validado: ${JSON.stringify(data)}`, "info");
 } catch (err) {
 // Si trae metadatos de validación, pintamos por campo
 if (err?.meta?.errors) {
 const { errors } = err.meta;
 if (errors.name) setFieldError("name", errors.name);
 if (errors.email) setFieldError("email", errors.email);
 setFormFeedback(" Corrige los campos indicados.", "error");
 log(`Validación fallida: ${JSON.stringify(errors)}`, "error");
 } else {
 // Error inesperado (no de validación controlada)
 setFormFeedback(" Error inesperado al validar", "error");
 log(`Error inesperado: ${err.message}`, "error");
 }
 }
});
// --- B. Carga de usuarios con async/await (API o mock) ---
async function handleLoad({ forceError = false } = {}) {
 // Limpia UI previa
 clearUsers();
 renderStatus("Cargando usuarios...", "loading");
 log(`Inicio carga usuarios (mock=${useMockToggle.checked}, error=${forceError})`,
"info");
 try {
 // Carga y espera respuesta
 const users = await loadUsers({
 useMock: useMockToggle.checked,
 forceError
 });
 // Si todo va bien, renderizamos
 renderUsers(users);
 renderStatus(`Se cargaron ${users.length} usuarios.`, "success");
 log(`Usuarios cargados: ${users.length}`, "info");
 } catch (err) {
 // Cualquier error controlado/inesperado llega aquí
 renderStatus(`Error: ${err.message}`, "error");
 log(`ERROR carga usuarios: ${err.message} | meta=${JSON.stringify(err.meta ?? {})}`,
"error");
 } finally {
 // Siempre se ejecuta
 log("Operación finalizada (finally)", "info");
 }
}
// Enlazamos botones a handler
btnLoad.addEventListener("click", () => handleLoad());
btnLoadError.addEventListener("click", () => handleLoad({ forceError: true }));
