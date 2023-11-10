const { OpenAI } = require("openai");
const { generateImagesFromPrompt } = require("./generateImageFromPost");
const fs = require('fs').promises;
require('dotenv').config();

// Inicializar cliente de OpenAI con la clave API de las variables de entorno
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
}


/**
 * Genera una historia basada en un tema y subtema dados.
 * @param {string} theme - El tema principal para la historia.
 * @param {string} subtheme - El subtema de la historia.
 * @returns {Promise<string>} - La historia generada.
 */
async function generateStory(theme, subtheme) {
    console.log(`...Generate story for ${theme} ${subtheme}...`)
    const prompt = `Dentro de la materia general "${theme}" y más en específico de "${subtheme}" eres un experto en el tema 
                    y necesito 1 posts para Instagram, de entre 3-5 pasos que una persona debería de hacer para acometer esos puntos y que le sirva como guía 
                    y que sean distintos a los posts que escribiste anteriormente sobre el mismo tema.
                    Recuerda que son posts para instagram, así que ponlos bonitos. Por favor, no me añadas imagenes tipo.`;

    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4-0613",
        });

        // Retorna la respuesta generada
        return chatCompletion.choices[0].message.content;
    } catch (error) {
        console.error("Error al obtener la respuesta de OpenAI:", error);
        throw error; // Relanzar el error para manejarlo en el llamador
    }
}

/**
 * Construye el objeto de resultados basado en los temas y subtemas.
 * @returns {Promise<void>}
 */
async function generatePostsWithTextAndImages(qttPosts, filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const temas = JSON.parse(data);
        var result = [];

        console.log("...Reading JSON to create posts...")
        for (const tema of temas) {
            let temaObject = {
                tema: tema.nombre,
                subtemas: []
            };

            for (const subtema of tema.subtemas) {
                let subtemaObject = {
                    subtema: subtema,
                    posts: []
                };
                let idrandom;
                console.log(qttPosts)
                for (let i = 0; i < qttPosts; i++) {
                    idrandom = generateRandomString(10);
                    const story = await generateStory(tema.nombre, subtema);
                    const post = {
                      id: idrandom, // Genera un ID aleatorio para el post
                      content: story
                    };
                    generateImagesFromPrompt(idrandom, story, tema.color);
                    subtemaObject.posts.push(post);
                    

                }
                temaObject.subtemas.push(subtemaObject);
            }
            result.push(temaObject);
        }

        await fs.writeFile('temasConHistoriasV2.json', JSON.stringify(result, null, 2), 'utf8');
    } catch (error) {
        console.error("Error al leer o procesar el archivo JSON:", error);
    }
}

// Función principal que se ejecuta al iniciar el script
async function main(filePath, postNumberBySubTopic) {
    await generatePostsWithTextAndImages(postNumberBySubTopic, filePath);
}

const jsonFilePath = process.argv[2] || 'topicsandsubtopics.json';
const postNumberBySubTopic = process.argv[3] || process.env.NUM_POSTS_PER_TOPIC;

// Manejo de errores en la función principal
main(jsonFilePath, postNumberBySubTopic).catch(console.error)


exports.generateStory = generateStory;