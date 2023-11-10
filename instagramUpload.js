const axios = require('axios');
require('dotenv').config();

const igUserId = process.env.ONLYHABITS_ID;
const token = process.env.ACCES_TOKEN;

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

createContainer()
    .then(containerId => {
        uploadPost(containerId);
        console.log("Done")
    })
    .catch(error => {
        console.error('Error en la creación del contenedor:', error);
    });
