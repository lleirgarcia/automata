const { OpenAI } = require("openai");
const { json } = require("stream/consumers");
const fs = require('fs').promises;
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

var theme = "topic"
var subtheme = "subtopic"
var prompt;

async function generateStory(t, s) {
    theme = t;
    subtheme = s;
    prompt = `Dentro de la materia general "${theme}" y mas en especifico de "${subtheme}" eres un experto en el tema 
              y necesito 1 posts para Instagram, de entre 3-5 pasos que una persona debería de hacer para acometer esos puntos y que le sirva como guia. 
              Recuerda que son posts para instagram, asi que ponlos bonitos.`;

    console.log("Tema: " + t)
    console.log("SubTema: " + s)

    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4-0613",
        });

        // Mostrar la respuesta en la consola
        console.log(chatCompletion.choices[0]);

    } catch (error) {
        console.error("Error al obtener la respuesta de OpenAI:", error);
    }
}

/** JSON Object in building... */
async function main() {
  try {
    const data = await fs.readFile('topicandsubtopiclist.json', 'utf8');
    const temas = JSON.parse(data);
    var result = [];

    for (const tema of temas) {
      var post = [];
      
      for (const subtema of tema.subtemas) {
        var entity = [];
        // const story = await generateStory(tema.nombre, subtema);
        const story = {
          index: 0,
          message: {
            role: 'assistant',
            content: 'Post 1:\n' +
              '\n' +
              'Imagen: Una silueta de una persona subiendo escaleras que se convierten en una línea de progreso ascendente.\n' +
              '\n' +
              'Título: "Establece y persigue tus metas ¡Haz que tu futuro brille! ⭐"\n' +
              '\n' +
              'Contenido:\n' +
              '\n' +
              'Paso 1: 🧠 Definición de Metas: ¿Qué es lo que realmente quieres alcanzar? Visualiza tus metas y asegúrate de que sean específicas, medibles, alcanzables, relevantes y basadas en el tiempo (S.M.A.R.T.).\n' +
              '\n' +
              'Paso 2: 📝 Escríbelas: Plasmar tus metas en papel es la primera etapa para llevarlas a la realidad. Usa palabras que inspiren acción y compromiso. \n' +
              '\n' +
              'Paso 3: 🖼️ Crea un Mapa de Sueños: Un mapa visual de tus metas ayuda a cimentar tu dedicación. Puede ser un collage, un dibujo o cualquier cosa que te inspire a moverte hacia tus metas.\n' +
              '\n' +
              'Paso 4: 🚧 Plan de Acción: Desglosa tus metas en pasos más pequeños. ¿Qué puedes hacer hoy, esta semana, este mes para acercarte a tus metas? \n' +
              '\n' +
              'Paso 5: 💃 Monitoriza y celebra tu Progreso: Asegúrate de recompensarte por pequeños logros en el camino. ¡Recuerda que la perseverancia y la paciencia son clave para el éxito! \n' +
              '\n' +
              'Final: "Recuerda, tus metas son semillas que requieren tiempo y esfuerzo para germinar 🌱. ¡Es tu momento, déjate crecer!"\n' +
              '\n' +
              '#CrecimientoPersonal #DesarrolloCreativo #Metas #Planificación\n' +
              '\n' +
              '[IMAGEN INSPIRACIONAL: Silueta de persona subiendo una línea de progreso hacia una estrella brillante][QUOTE: "El éxito es la suma de pequeños esfuerzos repetidos día tras día." - Robert Collier]'
          },
          finish_reason: 'stop'
        }
        entity["titulo"] = subtema;
        entity.push(story['message']['content'])
        post.push(entity)
      }
      result['temaGenerico'] = tema.nombre;
      result.push(post)
    }
    console.log(result)
    await fs.writeFile('temasConHistorias.json', JSON.stringify(result, null, 2), 'utf8');
  } catch (error) {
    console.error("Error al leer o procesar el archivo JSON:", error);
  }
}

main().catch(console.error);