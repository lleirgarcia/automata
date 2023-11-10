const { OpenAI } = require("openai");
const { json } = require("stream/consumers");
const { generateImage } = require("./createImageFromAPrompt");
const { generatePrompt } = require("./chatgpt_model4");
const axios = require('axios');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');
const { url } = require("inspector");

require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

function prepareTextForAPrompt(post) {
  let removeSteps = `Remueve los pasos y hazme historia real del post y generame un prompt para generar una imagen en DALL-E: `
  let currentPost;

  if(post)
      currentPost = post
  else {
      currentPost= "Post 1:\n\n\"🌟ESTABLECIMIENTO Y SEGUIMIENTO DE METAS 🌟\n\n1️⃣ DEFINE TU META: Pregúntate 👤 ¿Qué quiero alcanzar?, asegúrate de que tu meta sea SMART: Específica, Medible, Alcanzable, Realista y con un Tiempo definido.\n\n2️⃣ PLANIFICA TU ACCIÓN: 📝 ¿Cómo llegarás a tu meta? Diseña un plan de acción detallado y sigue cada paso.\n\n3️⃣ ESTABLECE HITOS: Desglosa tu objetivo general en mini objetivos a corto plazo. Te ayudará a mantener tu motivación y a entender que estás progresando. 📈\n\n4️⃣ EVALÚA Y AJUSTA: Evalúa 🧐 tu avance regularmente para asegurarte de que estás en el camino correcto. No tengas miedo de hacer ajustes necesarios.\n\n5️⃣ CELEBRA TUS LOGROS: 🎉 ¡No olvides celebrar cada logro, no importa cuán pequeño sea! Eso te mantendrá motivado para seguir adelante.\n\nRecuerda siempre, el éxito es la suma de pequeños esfuerzos, repetidos día tras día. Así que mantén tus ojos en la meta, y no desistas. 💪💫\""
  }

  return `${removeSteps} ${currentPost}`;
}

async function generatePromptForDALLE(post = "", color = "green", style = "high resolution") {
  let colorAndQuality = `Color of images should be ${color} and with marble dark ${color} in the background. An ${style} image with high quality.`
  let promptGenerated;
  let fullPromptForImage;
  let generatedPromptToAskDalle;
  
  generatedPromptToAskDalle = prepareTextForAPrompt(post);
  promptGenerated = await generatePrompt(generatedPromptToAskDalle)
  fullPromptForImage = `${promptGenerated} ${colorAndQuality}`
  console.log(`Full prompt to make DALL-E image: ${fullPromptForImage}`)
  return fullPromptForImage;
}

async function generateImagesFromPrompt(id = "", post = "", color = "green", style = "hiper realistic with high resolution") {
    console.log(`...Start generating Images...`)
    let filePath = "./imagenes/";
    let pngFolder = './imagenes/png/';
    let image;
    let prompt = await generatePromptForDALLE(post, color, style);
    
    console.log(`---From prompt: ${prompt}`)
    if(process.env.IMAGE_GEN_ACTIVE) {
      image = await generateImage(prompt) // comentar pq sino esto perdera muchos tokens y me valdrá bastante pasta.
    } else {
      // image = {
      //   created: 1699553319,
      //   data: [
      //     {
      //       revised_prompt: 'An open self-help book showcasing the steps to set and follow goals, surrounded by colorful pencils, a written goal list, and a coffee cup. The color scheme of the image should be green, with a dark green marble background. The image should be high-resolution and of high quality.',
      //       url: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-G0SaRXS9TvdcEeUmV4i6snDR/user-65IiMGTl5V05UdgD1Ypj92My/img-wjlj6mLJ5SZORNdMNusqVsRu.png?st=2023-11-09T17%3A13%3A38Z&se=2023-11-09T19%3A13%3A38Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-11-09T06%3A55%3A34Z&ske=2023-11-10T06%3A55%3A34Z&sks=b&skv=2021-08-06&sig=RDGfRnAXtleZtaFhLOmaiB1mRplzwBaanp/k5yjA6xo%3D'
      //     }
      //   ]
      // }
    }
      
    console.log("Imagen: ")
    console.log(image)
    console.log("...Guardando imagen...")
    await downloadImage(image , `${filePath}${id}.png`)
        .then(() => console.log('Imagen descargada con éxito.'))
        .catch(err => console.error('Error al descargar la imagen:', err));
      
    // Convertir PNG a JPG TODO meter en una funcion nueva
    await sharp(`${filePath}${id}`)
    .toFormat('jpeg')
    .toFile(`${pngFolder}${id}.jpg`)
    .then(() => {
      console.log('Conversión completada');

      // Crear la carpeta ./imagenes/png si no existe
      if (!fs.existsSync(pngFolder)){
        fs.mkdirSync(pngFolder, { recursive: true });
      }

      // Mover el archivo PNG original a la carpeta ./imagenes/png
      let oldPath = `${filePath}${id}.png`;
      let newPath = path.join(pngFolder, `${id}.png`);
      fs.rename(oldPath, newPath, (err) => {
        if (err) throw err;
        console.log(`El archivo PNG ha sido movido a ${newPath}`);
      });
    })
    .catch(err => {
      console.error('Error al convertir la imagen', err);
    });

}


// Función para descargar una imagen dada una URL
async function downloadImage(url, imagePath) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  const writer = fs.createWriteStream(imagePath);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

exports.generateImagesFromPrompt = generateImagesFromPrompt
