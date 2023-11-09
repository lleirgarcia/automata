const fs = require('fs').promises;

class JsonBuilder {
  constructor() {
    this.topics = [];
  }

  addTemaGenerico(temaGenerico) {
    const newTema = {
      temaGenerico,
      subTemas: []
    };
    this.topics.push(newTema);
    return newTema;
  }

  addSubTema(temaGenerico, tituloSubTema, descripcion = '', tendencia = '') {
    const tema = this.findOrCreateTemaGenerico(temaGenerico);
    const newSubTema = {
      titulo: tituloSubTema,
      descripcion,
      tendencia,
      posts: []
    };
    tema.subTemas.push(newSubTema);
    return newSubTema;
  }

  addPost(temaGenerico, tituloSubTema, tituloPost, contenido) {
    const subTema = this.findOrCreateSubTema(temaGenerico, tituloSubTema);
    const newPost = {
      tituloPost,
      contenido
    };
    subTema.posts.push(newPost);
  }

  findOrCreateTemaGenerico(temaGenerico) {
    let tema = this.topics.find(t => t.temaGenerico === temaGenerico);
    if (!tema) {
      tema = this.addTemaGenerico(temaGenerico);
    }
    return tema;
  }

  findOrCreateSubTema(temaGenerico, tituloSubTema) {
    const tema = this.findOrCreateTemaGenerico(temaGenerico);
    let subTema = tema.subTemas.find(st => st.titulo === tituloSubTema);
    if (!subTema) {
      subTema = this.addSubTema(temaGenerico, tituloSubTema);
    }
    return subTema;
  }

  async saveToFile(filePath) {
    await fs.writeFile(filePath, JSON.stringify(this.topics, null, 2), 'utf8');
    console.log('El archivo JSON ha sido guardado correctamente.');
  }
}

// Ejemplo de uso
async function buildAndSaveJson() {
  const builder = new JsonBuilder();

  // Supongamos que estos datos vienen de la entrada del usuario
  builder.addTemaGenerico("Desarrollo Personal");
  builder.addSubTema("Desarrollo Personal", "Habilidades Sociales");
  builder.addPost("Desarrollo Personal", "Habilidades Sociales", "Cómo mejorar la comunicación", "Contenido del post aquí");

  // Añadir más temas, subtemas y posts según sea necesario
  // ...

  // Guardar la estructura en un archivo cuando hayas terminado de construir el JSON
  await builder.saveToFile('./data.json');
}

buildAndSaveJson().catch(console.error);
