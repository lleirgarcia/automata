const { OpenAI } = require("openai");
const { generateImagesFromPrompt } = require("./generateImageFromPost");
const { proximoColor, guardarUltimoColor } = require("./lastColorHandle");
const fs = require('fs').promises;
require('dotenv').config({ path: './openai.env' });
require('dotenv').config();

let token;

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
                    En el caso de que enumeres puntos o pasos (1, 2, 3), utiliza los emojis de watsapp, solamente 1 al principio del todo y enumera los pasos como "step 1, step 2, etc".
                    Si hablas de pasos deja solo la palabra "step" y el numero en emoji al que toque. No añadas extras
                    Dejalo limpio de asteriscos que no aportan nada (**).
                    Dejalo limpio de comillas que no sirven (").
                    Intenta tambien no poner mayusculas en palabras que ya estan dentro de una frase, dejalas en minusculas a no ser que sea necesario.`;

                    console.log(prompt)
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
async function generatePostsWithTextAndImages(qttPosts, filePath, temaSubTema, ultimoColor) {
    console.log("...Reading JSON to create posts by JSON...")
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const temas = JSON.parse(data);
        var result = [];
        
        let colorH = proximoColor(ultimoColor);
        let tema = encontrarSubtemaAleatorioPorColor(temas, colorH);
        
        console.log(colorH)
        console.log(tema)

        // Crear objeto para el resultado
        let resultado = {
            tema: tema.temaConMasSubtemas,
            subtemas: [
                {
                    posts: []
                }
            ]
        };

        // Generar publicaciones para el subtema seleccionado
        for (let i = 0; i < qttPosts; i++) {
            let idrandom = generateRandomString(10);
            console.log("tema: " + tema.temaConMasSubtemas)
            console.log("subtema: " + tema.subtemaAleatorio.nombre)
            const story = await generateStory(tema.temaConMasSubtemas, tema.subtemaAleatorio.nombre);
            const post = {
                id: idrandom, // Genera un ID aleatorio para el post
                content: story
            };
            generateImagesFromPrompt(idrandom, story, tema.subtemaAleatorio.color);
            resultado.subtemas[0].posts.push(post);
        }
        removeSubtema(temas, tema.temaConMasSubtemas, tema.subtemaAleatorio.nombre)
        result.push(resultado)

        // Guardar el resultado en un nuevo archivo
        await fs.writeFile('temasConHistoriasV2.json', JSON.stringify(result, null, 2), 'utf8');
        guardarUltimoColor(colorH);
    } catch (error) {
        console.error("Error al leer o procesar el archivo JSON:", error);
    }
}

function encontrarSubtemaAleatorioPorColor(data, color) {
  // Filtrar temas por color
  let temasFiltrados = data.filter(tema => tema.color === color);
  let mainTopic;  
  
  let subtemas = [];
  temasFiltrados.forEach(tema => {
    subtemas.push(...tema.subtemas.filter(subtema => subtema.color === color));
    mainTopic = tema;
  });

  // Elegir un subtema aleatorio
  if (subtemas.length > 0) {
    let subtemaAleatorio = subtemas[Math.floor(Math.random() * subtemas.length)];
    return {
        temaConMasSubtemas: mainTopic.nombre,
        subtemaAleatorio: subtemaAleatorio
    };
  } else {
    return null;
  }
}





function removeSubtema(dataJson, temaPrincipal, subtemaNombre) {

    // Encuentra el tema principal en el array
    const tema = dataJson.find(t => t.nombre === temaPrincipal);
    
    if (!tema) {
        console.log("Tema principal no encontrado.");
        return;
    }

    // Filtra los subtemas para excluir el que coincide con subtemaNombre
    tema.subtemas = tema.subtemas.filter(st => st.nombre !== subtemaNombre);
    fs.writeFile("topicsandsubtopics.json", JSON.stringify(dataJson, null, 2));
}


// /**
//  * Construye el objeto de resultados basado en los temas y subtemas.
//  * @returns {Promise<void>}
//  */
// async function generatePostsWithTextAndImages(temaSubtema) {
//     console.log("dasdasdasdad")
//     try {
//         var result = [];
//         const partes = temaSubtema.split(',');

//         var tema = partes[0];
//         var subtema = partes[1];
//         var color = partes[2];

//         console.log("...Reading topic...")
//         console.log(`Tema ${tema}, Subtema ${subtema}, Color ${color}`)

//         let temaObject = {
//             tema: tema,
//             subtemas: []
//         };
            
//         let subtemaObject = {
//             subtema: subtema,
//             posts: []
//         };
//         let idrandom;
                
//         idrandom = generateRandomString(10);
//         const story = await generateStory(tema, subtema);
//         const post = {
//             id: idrandom, // Genera un ID aleatorio para el post
//             content: story
//         };
//         generateImagesFromPrompt(idrandom, story, color);
//         subtemaObject.posts.push(post);      
//         temaObject.subtemas.push(subtemaObject);
//         result.push(temaObject);
        
    
//         await fs.writeFile('temasConHistoriasV2.json', JSON.stringify(result, null, 2), 'utf8');
//     } catch (error) {
//         console.error("Error al leer o procesar el archivo JSON:", error);
//     }
// }

// Función principal que se ejecuta al iniciar el script
async function main(filePath, postNumberBySubTopic, temaSubtema, ultimoColor) {
    console.log("dentro el script")
    console.log("args filepath: " + filePath)
    console.log("args  posts: " + postNumberBySubTopic)
    console.log("args temas subtema: " + temaSubtema)
    console.log("ultimo color: " + ultimoColor)

    let json = filePath != undefined && (temaSubtema == undefined || temaSubtema == "")
    console.log("From json: " + json)
    if(json) {
        await generatePostsWithTextAndImages(postNumberBySubTopic, filePath, temaSubtema, ultimoColor);
    } 
}

const jsonFilePath = process.argv[2] || 'topicsandsubtopics.json';
const postNumberBySubTopic = process.argv[3] || process.env.NUM_POSTS_PER_TOPIC;
const temaSubtema = process.argv[4];
const ultimoColor = process.argv[5];

// Manejo de errores en la función principal
main(jsonFilePath, postNumberBySubTopic, temaSubtema, ultimoColor).catch(console.error)

exports.generateStory = generateStory;