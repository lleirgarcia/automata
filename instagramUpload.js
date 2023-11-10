// const axios = require('axios');
// require('dotenv').config();

// const igUserId = process.env.ONLYHABITS_ID;
// const token = process.env.ACCES_TOKEN;

async function createContainer() {
    const urlMedia = `https://graph.facebook.com/v18.0/${igUserId}/media`;
   
    const params = {
        image_url: 'https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg',
        caption: 'pruebita',
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

// createContainer()
//     .then(containerId => {
//         uploadPost(containerId);
//         console.log("Done")
//     })
//     .catch(error => {
//         console.error('Error en la creación del contenedor:', error);
//     });




    // -------

const axios = require('axios');
const fs = require('fs').promises;
require('dotenv').config();

const igUserId = process.env.ONLYHABITS_ID;
const token = process.env.ACCES_TOKEN;
const jsonFilePath = './temasConHistoriasV2.json'; // Ruta al archivo JSON
const imagesFolderPath = './imagenes/'; // Ruta a la carpeta de imágenes

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
    try {
        const postData = await fs.readFile(jsonFilePath, 'utf8');
        const posts = JSON.parse(postData);

        for (const tema of posts) {
            for (const subtema of tema.subtemas) {
                for (const post of subtema.posts) {
                    const imageUrl = `${imagesFolderPath}${post.id}.jpg`; // Asumiendo que la imagen tiene el mismo ID que el post y es un archivo PNG
                    const containerId = await createContainer(imageUrl, post.content);
                    await uploadPost(containerId);
                }
            }
        }
        console.log("Todos los posts han sido subidos");
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
