const axios = require('axios');
const fs = require('fs').promises;
const { pushImagesToRepo } = require("./uploadCodeToRepo");
const { removePostById } = require("./removerSubtema");
require('dotenv').config();

const igUserId = process.env.ONLYHABITS_ID;
const token = process.env.ACCES_TOKEN;
const jsonFilePath = './temasConHistoriasV2.json'; // Ruta al archivo JSON
const imagesFolderPath = '/imagenes/'; // Ruta a la carpeta de imágenes

async function createContainer(imageUrl, caption) {
    const urlMedia = `https://graph.facebook.com/v18.0/${igUserId}/media`;
    const params = {
        image_url: imageUrl,
        caption: caption,
        access_token: token 
    };
    try {
        const response = await axios.post(urlMedia, params);
        return response.data.id; // Aquí asumo que response.data contiene el ID o identificador que necesitas.
    } catch (error) {
        console.error('Error:', error);
        throw error; // Lanza el error para manejarlo más arriba si es necesario
    }    
}

async function uploadPost(containerId) {
    const urlMediaPublish = `https://graph.facebook.com/v18.0/${igUserId}/media_publish`;
    const params = {
        creation_id: containerId,
        access_token: token
    };
    
    try {
        const response = await axios.post(urlMediaPublish, params);
        console.log('Respuesta:', response.data);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function main() {
    await pushImagesToRepo();
    try {
        const postData = await fs.readFile(jsonFilePath, 'utf8');
        const posts = JSON.parse(postData);

        for (const tema of posts) {
            for (const subtema of tema.subtemas) {
                for (const post of subtema.posts) {
                    let id = post.id;
                    const imageUrl = `https://raw.githubusercontent.com/lleirgarcia/automata/develop/imagenes/${id}.jpg`; // Asumiendo que la imagen tiene el mismo ID que el post y es un archivo PNG
                    console.log("Image")
                    console.log(imageUrl)
                    const containerId = await createContainer(imageUrl, post.content);
                    await uploadPost(containerId);
                    await removePostById(id);
                }
            }
        }
        console.log("Todos los posts han sido subidos");
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
