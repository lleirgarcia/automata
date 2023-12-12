const fs = require('fs');
const path = require('path');

// Ruta al archivo de estado en tu repositorio
const estadoArchivo = path.join(__dirname, 'ultimo_color.txt');

// Función para leer el último color publicado
function leerUltimoColor() {
    return fs.readFileSync(estadoArchivo, 'utf8').trim();
}

// Función para guardar el último color publicado
function guardarUltimoColor(color) {
    fs.writeFileSync(estadoArchivo, color, 'utf8');
}

// Función para determinar el próximo color
function proximoColor(ultimoColor) {
    const secuencia = ['verde', 'naranja', 'azul'];
    let indice = secuencia.indexOf(ultimoColor);
    let proximoIndice = (indice + 1) % secuencia.length;
    return secuencia[proximoIndice];
}

// Uso de las funciones
let ultimoColor = leerUltimoColor();
let colorParaPublicar = proximoColor(ultimoColor);

console.log(`Publicar post con color: ${colorParaPublicar}`);

// Simular publicación y luego actualizar el archivo de estado
// Aquí iría tu lógica de publicación
guardarUltimoColor(colorParaPublicar);

exports.proximoColor = proximoColor;