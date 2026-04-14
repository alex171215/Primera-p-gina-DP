// ===== Validaciones de formulario y error personalizado =====
import { AppError } from "./utils.js";
// Chequea vacío (string vacío, null, undefined)
export const isEmpty = v => !v || !String(v).trim();
// Validación básica de email (regex razonable para práctica)
export const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
// Valida un objeto con los campos del formulario.
// Si hay errores, lanza AppError con detalle por campo.
export function validateForm({ name, email }) {
 const errors = {};
 if (isEmpty(name)) errors.name = "El nombre es obligatorio";
 if (isEmpty(email)) errors.email = "El email es obligatorio";
 else if (!isEmail(email)) errors.email = "Formato de email inválido";
 if (Object.keys(errors).length) {
 // Cortamos el flujo y entregamos detalle para UI
 throw new AppError("Validación fallida", { errors });
 }
 return { ok: true };
}
