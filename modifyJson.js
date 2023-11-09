const fs = require('fs').promises;

async function modifyPostContent(filePath, postTitle, newContent) {
    try {
      // Leer el archivo JSON
      const data = await fs.readFile(filePath, 'utf8');
      const topics = JSON.parse(data);
  
      // Encontrar y actualizar el contenido del post
      const postFound = topics.some(topic =>
        topic.subTemas.some(subTema =>
          subTema.posts.some(post => {
            if (post.tituloPost === postTitle) {
              post.contenido = newContent;
              return true;
            }
            return false;
          })
        )
      );
  
      // Verificar si se encontró y modificó el post
      if (postFound) {
        // Guardar el JSON modificado de vuelta al archivo
        await fs.writeFile(filePath, JSON.stringify(topics, null, 2), 'utf8');
        console.log(`El post "${postTitle}" ha sido modificado y guardado correctamente.`);
      } else {
        console.log(`El post "${postTitle}" no se encontró.`);
      }
    } catch (error) {
      console.error('Error al modificar el JSON:', error);
    }
  }
  
  // Ruta al archivo JSON
  const filePath = './data.json'; // Asegúrate de que el archivo data.json esté en la misma carpeta que este script
  
  // Llama a la función y pasa el título del post que quieres modificar, junto con el nuevo contenido
  modifyPostContent(filePath, 'IA y Ética', 'Este es el nuevo contenido para el post de IA y Ética.').catch(console.error);
  