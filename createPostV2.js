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
    const prompt = `Dentro de la materia general "${theme}" y más en específico de "${subtheme}" eres un experto en el tema 
                    y necesito 1 posts para Instagram, de entre 3-5 pasos que una persona debería de hacer para acometer esos puntos y que le sirva como guía 
                    y que sean distintos a los posts que escribiste anteriormente sobre el mismo tema.
                    Recuerda que son posts para instagram, así que ponlos bonitos. Por favor, no me añadas imagenes tipo. 
                    Escribemelo en ${process.env.IDIOMA}.
                    En tu contestacion, escribeme unicamente los pasos o la descripcion que añadirias al post, nada de "Sure, I'd be happy to assist. Here's a suggestion for a post" ni enumeracion de posts ni nada por el estilo, solamente el texto que copiaré y pegaré para su uso.
                    En el caso de que enumeres puntos (1, 2, 3), utiliza los emojis de watsapp.
                    Dejalo limpio de asteriscos que no aportan nada (**).
                    Dejalo limpio de comillas que no sirven (").`;

    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4-0613",
        });

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
                console.log(temaObject.subtemas)
            }
            result.push(temaObject);
        }
        console.log("Resultados json:")
        console.log(result)
        
        await fs.writeFile('temasConHistoriasV2.json', JSON.stringify(result, null, 2), 'utf8');
    } catch (error) {
        console.error("Error al leer o procesar el archivo JSON:", error);
    }
}


/**
 * Construye el objeto de resultados basado en los temas y subtemas.
 * @returns {Promise<void>}
 */
async function generatePostsWithTextAndImages(temaSubtema) {
    try {
        var result = [];
        const partes = temaSubtema.split(',');

        var tema = partes[0];
        var subtema = partes[1];
        var color = partes[2];

        console.log("...Reading JSON to create posts...")

        let temaObject = {
            tema: tema,
            subtemas: []
        };
            
        let subtemaObject = {
            subtema: subtema,
            posts: []
        };
        let idrandom;
                
        idrandom = generateRandomString(10);
        const story = await generateStory(tema, subtema);
        const post = {
            id: idrandom, // Genera un ID aleatorio para el post
            content: story
        };
        generateImagesFromPrompt(idrandom, story, color);
        subtemaObject.posts.push(post);      
        temaObject.subtemas.push(subtemaObject);
        result.push(temaObject);
        
    
        await fs.writeFile('temasConHistoriasV2.json', JSON.stringify(result, null, 2), 'utf8');
    } catch (error) {
        console.error("Error al leer o procesar el archivo JSON:", error);
    }
}

// Función principal que se ejecuta al iniciar el script
async function main(filePath, postNumberBySubTopic, temaSubtema) {
console.log("dentro el script")
    if(temaSubtema)
        await generatePostsWithTextAndImages(temaSubtema);
    else
        await generatePostsWithTextAndImages(postNumberBySubTopic, filePath);
}

const jsonFilePath = process.argv[2] || 'topicsandsubtopics.json';
const postNumberBySubTopic = process.argv[3] || process.env.NUM_POSTS_PER_TOPIC;
const temaSubtema = process.argv[4];

// Manejo de errores en la función principal
main(jsonFilePath, postNumberBySubTopic, temaSubtema).catch(console.error)

exports.generateStory = generateStory;