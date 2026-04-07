// ===== Identificador de versión (para confirmar que cargó este archivo) =====
console.log('%cSemana2 app.js HOTFIX v5', 'color:green', new Date().toISOString());
// ===== Utilidades de mensajes =====
function plural(n, uno, otros){ return n === 1 ? uno : otros; }
const messages = {
valueMissing: 'Completa este campo.',
typeMismatch: 'Revisa el formato (p. ej., usuario@dominio).',
patternMismatch: 'Sigue el formato indicado.',
tooShort: el => {
const rest = el.minLength - el.value.length;
return `Añade ${rest} ${plural(rest,'carácter','caracteres')} más.`;
},
tooLong: el => `Reduce a ${el.maxLength} caracteres.`,
rangeUnderflow: el => `El valor mínimo es ${el.min}.`,
rangeOverflow: el => `El valor máximo es ${el.max}.`,
stepMismatch: 'Ajusta al paso permitido.',
badInput: 'Usa solo números en este campo.',
customError: el => el.validationMessage || 'Revisa este dato.'
};
function nativeMessage(el){
const v = el.validity;
if (v.valid) return '';
for (const k of Object.keys(messages)){
if (v[k]){
const m = messages[k];
return typeof m === 'function' ? m(el) : m;
}
}
return 'Revisa este dato.';
}
function showError(el, msg){
const ids = (el.getAttribute('aria-describedby')||'').split(' ');
const errId = ids.find(id => id && id.endsWith('-err'));
const errEl = errId ? document.getElementById(errId) : null;
el.setCustomValidity(msg||'');
if (msg){
el.setAttribute('aria-invalid','true');
if (errEl){ errEl.textContent = msg; errEl.hidden = false; }
} else {
el.removeAttribute('aria-invalid');
if (errEl){ errEl.hidden = true; errEl.textContent = ''; }
}
}
function renderSummary(form, invalidFields){
const box = document.getElementById('form-summary');
if (!invalidFields.length){ box.innerHTML = ''; return; }
const items = invalidFields.map(({el, msg})=>{
const label = form.querySelector(`label[for="${el.id}"]`);
const texto = label ? label.textContent.trim() : el.name || el.id;
return `<li><a href="#${el.id}">${texto}:</a> ${msg}</li>`;
}).join('');
box.innerHTML = `<p>Por favor, corrige lo siguiente:</p><ul>${items}</ul>`;
}
function passwordStrength(value, minLen){
let s = 0;
if (value.length >= minLen) s++;
if (/[A-Z]/.test(value)) s++;
if (/\d/.test(value)) s++;
if (/[^A-Za-z0-9]/.test(value)) s++;
return s; // 0..4
}
document.addEventListener('DOMContentLoaded', () => {
const form = document.getElementById('f-registro');
const fields = form.querySelectorAll('input, select, textarea');
const email = document.getElementById('email');
const emailStatus= document.getElementById('email-status');
let emailTimer = 0, emailQuery = 0;
const pass = document.getElementById('pass');
const pass2 = document.getElementById('pass2');
const passMeter = document.getElementById('pass-strength');
const passText = document.getElementById('pass-strength-text');
const passHint = document.getElementById('hint-pass');
// ===== Config global de contraseña =====
const DESIRED_MIN = 8; // cambia a 12/16 si quieres
// Quita cualquier minlength que venga del HTML o de otro script
if (pass.hasAttribute('minlength')) pass.removeAttribute('minlength');
// Refleja el mínimo en el hint
if (passHint) passHint.textContent =
`Mínimo ${DESIRED_MIN} caracteres. Combina mayúsculas, números y símbolos.`;
// ===== Validación nativa para todo MENOS 'pass' (que controlamos nosotros) =====
fields.forEach(el => {
if (el.id === 'pass') return;
el.addEventListener('input', () => showError(el, nativeMessage(el)));
el.addEventListener('blur', () => showError(el, nativeMessage(el)));
});
// ===== Regla de longitud propia para 'pass' =====
function checkPasswordMin(){
const rest = DESIRED_MIN - pass.value.length;
if (rest > 0){
const msg = `Mínimo ${DESIRED_MIN} caracteres. Añade ${rest}
${plural(rest,'carácter','caracteres')}.`;
pass.setCustomValidity(msg);
showError(pass, msg);
} else {
pass.setCustomValidity('');
showError(pass, '');
}
}
// Fuerza y mensajes accesibles
pass.addEventListener('input', () => {
checkPasswordMin(); // primero nuestra regla
const score = passwordStrength(pass.value, DESIRED_MIN);
passMeter.value = score;
const textos = ['Muy débil','Débil','Aceptable','Buena','Fuerte'];
passText.textContent = pass.value ? `Fuerza: ${textos[score]}` : '';
});
pass.addEventListener('blur', checkPasswordMin);
// Confirmación de contraseña
function checkPasswords(){
pass2.setCustomValidity(''); showError(pass2, '');
if (pass.value && pass2.value && pass.value !== pass2.value){
const msg = 'La confirmación no coincide con la contraseña.';
pass2.setCustomValidity(msg); showError(pass2, msg);
}
}
pass.addEventListener('input', checkPasswords);
pass2.addEventListener('input', checkPasswords);
// Validación asíncrona simulada para correo (debounce 300 ms)
email.addEventListener('input', () => {
clearTimeout(emailTimer);
emailStatus.textContent = '';
if (!email.checkValidity()) return;
emailTimer = setTimeout(() => {
const qid = ++emailQuery;
emailStatus.textContent = 'Comprobando disponibilidad…';
// Simulación: "existe" si incluye "test"
const exists = /test/i.test(email.value);
setTimeout(() => {
if (qid !== emailQuery) return; // respuesta vieja
if (exists){
const msg = 'Este correo ya está registrado. ¿Quieres iniciar sesión?';
email.setCustomValidity(msg);
showError(email, msg);
emailStatus.textContent = 'Ya registrado.';
} else {
email.setCustomValidity('');
showError(email, '');
emailStatus.textContent = 'Disponible.';
}
}, 300);
}, 300);
});
// Envío: muestra resumen y enfoca el primer error
form.addEventListener('submit', (e) => {
const invalid = [];
// Revisa todos menos 'pass' con nativo
for (const el of fields){
if (el.id === 'pass') continue;
const msg = nativeMessage(el);
showError(el, msg);
if (msg) invalid.push({el, msg});
}
// Reglas propias
checkPasswordMin();
checkPasswords();
if (!pass.validity.valid) invalid.push({el: pass, msg: pass.validationMessage});
if (!pass2.validity.valid) invalid.push({el: pass2, msg: pass2.validationMessage});
if (invalid.length){
e.preventDefault();
renderSummary(form, invalid);
invalid[0].el.focus();
} else {
renderSummary(form, []);
// aquí enviaría normalmente
}
});
});