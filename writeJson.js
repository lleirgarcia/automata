const fs = require('fs').promises;

const filePath = './data_ejemplo_manual.json'; // La ruta al archivo JSON

// Función para añadir un nuevo post a un subtema o crear el archivo si no existe
async function addNewPost(subTemaTitulo, nuevoPost) {
  let topics;
  try {
    // Intentar leer el archivo JSON
    try {
      const data = await fs.readFile(filePath, 'utf8');
      topics = JSON.parse(data);
    } catch (readError) {
      // Si el archivo no existe, inicializar la estructura del JSON por defecto
      console.log('El archivo no existe. Se creará una nueva estructura JSON.');
      topics = [
        {
          "temaGenerico": "Crecimiento Personal y Desarrollo de Habilidades",
          "subTemas": [
            {
              "titulo": subTemaTitulo,
              "descripcion": "Descripción por defecto del subtema.",
              "tendencia": "Por determinar",
              "posts": []
            }
          ]
        }
      ];
    }

    // Buscar el subtema específico y añadir el nuevo post
    let subTemaFound = false;
    topics.forEach(topic => {
      topic.subTemas.forEach(subTema => {
        if (subTema.titulo === subTemaTitulo) {
          // Añadir el nuevo post al subtema
          subTema.posts.push(nuevoPost);
          subTemaFound = true;
        }
      });
    });

    // Si no se encontró el subtema, añadir un nuevo subtema al tema genérico
    if (!subTemaFound) {
      topics[0].subTemas.push({
        titulo: subTemaTitulo,
        descripcion: "Descripción por defecto del subtema.",
        tendencia: "Por determinar",
        posts: [nuevoPost]
      });
    }

    // Guardar el nuevo JSON en el archivo
    await fs.writeFile(filePath, JSON.stringify(topics, null, 2), 'utf8');
    console.log(`Nuevo post añadido al subtema "${subTemaTitulo}".`);

  } catch (error) {
    console.error('Error al añadir un nuevo post o crear el archivo JSON:', error);
  }
}

// Ejemplo de uso de la función
const nuevoPost = {
  tituloPost: "La importancia de la constancia",
  contenido: "Mantener un esfuerzo constante es clave para el logro de objetivos a largo plazo."
};

addNewPost("Establecimiento y seguimiento de metas", nuevoPost).catch(console.error);
