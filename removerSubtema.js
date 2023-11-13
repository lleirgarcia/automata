const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

/**
 * Elimina un objeto del array JSON basado en un ID y sobrescribe el archivo.
 * @param {string} filePath - Ruta del archivo JSON.
 * @param {string} id - ID del objeto a eliminar.
 */async function removePostById(idToRemove, filePath = process.env.JSON_RESULT) {
    try {
        // Leer el archivo JSON
        const data = await fs.readFile(filePath, 'utf8');
        const temas = JSON.parse(data);

        let postFound = false;

        // Recorrer los temas para encontrar y eliminar el post
        for (let i = 0; i < temas.length; i++) {
            const tema = temas[i];
            for (let j = 0; j < tema.subtemas.length; j++) {
                const subtema = tema.subtemas[j];
                const index = subtema.posts.findIndex(post => post.id === idToRemove);
                if (index > -1) {
                    // Eliminar el post
                    subtema.posts.splice(index, 1);
                    console.log(`Post con ID ${idToRemove} eliminado.`);
                    postFound = true;

                    // Si el subtema está vacío, eliminarlo
                    if (subtema.posts.length === 0) {
                        tema.subtemas.splice(j, 1);
                        j--; // Ajustar el índice del bucle
                        console.log('Subtema eliminado por no tener más posts.');
                    }

                    // Si el tema no tiene más subtemas, eliminarlo
                    if (tema.subtemas.length === 0) {
                        temas.splice(i, 1);
                        i--; // Ajustar el índice del bucle
                        console.log('Tema eliminado por no tener más subtemas.');
                    }
                    break;
                }
            }
            if (postFound) break;
        }

        // Sobrescribir el archivo si se encontró y eliminó el post
        if (postFound) {
            await fs.writeFile(filePath, JSON.stringify(temas, null, 2), 'utf8');
            console.log(`Archivo JSON actualizado.`);
        } else {
            console.log(`No se encontró ningún post con ID ${idToRemove}.`);
        }
    } catch (error) {
        console.error('Error al eliminar el post, subtema o tema:', error);
    }
}

exports.removePostById = removePostById
