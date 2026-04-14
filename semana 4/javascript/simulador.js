// Función que simula una operación asíncrona
function servicioSimulado(forzarError = false) {
 return new Promise((resolve, reject) => {
 const tiempo = Math.floor(Math.random() * 2000) + 1000; // 1-3s
 const exito = forzarError ? false : Math.random() > 0.3; // 70% éxito
 setTimeout(() => {
 if (exito) {
 resolve({ mensaje: "Datos recibidos correctamente", codigo: 200 });
 } else {
 reject({ mensaje: "Falla en el servidor remoto", codigo: 500 });
 }
 }, tiempo);
 });
}

// Elementos de la interfaz
const estado = document.getElementById("estado");
const log = document.getElementById("log");


// Clase de error personalizada
class ServicioError extends Error {
 constructor(mensaje, codigo) {
 super(mensaje);
 this.name = "ServicioError";
 this.codigo = codigo;
 }
}


// Función genérica para ejecutar el servicio
async function ejecutarSimulacion(forzarError = null) {
 estado.textContent = "Procesando...";
 log.textContent = "";
 try {
 // Se lanza la promesa y se espera su resultado
 const respuesta = await servicioSimulado(forzarError);
 estado.textContent = "✅ Éxito";
 log.textContent = JSON.stringify(respuesta, null, 2);
 } catch (error) {
 // Se captura cualquier error (objeto rechazado)
 estado.textContent = "❌ Error detectado";
 log.textContent = JSON.stringify(error, null, 2);
 } finally {
 // Se ejecuta siempre, ocurra o no error
 console.log("Simulación finalizada");
 }
}
// Enlaces a los botones
document.getElementById("btn-ok").onclick = () => ejecutarSimulacion(false);
document.getElementById("btn-error").onclick = () => ejecutarSimulacion(true);
document.getElementById("btn-random").onclick = () => ejecutarSimulacion(null);
