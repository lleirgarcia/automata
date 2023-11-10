# A U T O M A T A


# next steps
- [x] generar posts para Instagram desde 1 tema generico y un sub tema.
- [x] hacer esto cada X veces (segun los temas y subtemas de un JSON y X veces por cada tema)
- [x] de los posts genero prompts a modo de historias para autogenerar imagenes para los posts
- [x] guardo imagenes en el host y las enlazo por cada posts segun un ID
- [x] prueba de subida de posts a instagram
- [] subir desde el host a instagram lo que hay el local
- [] programar las subidas
    - [] Jenkins Docker en local siempre levantado
- [] lo mismo de instagram, para twitter

- [] subir las imagenes a un aws o por el estilo https://aws.amazon.com/es/s3/
    - luego de alli tenerlas disponibles



- [] ideas.
    - [] hacer otra cuenta y meter videos de llados.
    - [] ver como de manera automatica puedo autogenerar clips de youtube.
    - [] transcribir esos clips y generar texto pasa instagram o twitter.
    - [] motivacion: automatizar la recogida de clips y autogeneracion de contenido de Llados y esta peña



# execution

1. Take a look in topicsandsubtopics.json to define Topics and Sub topics.
2. La imagen autogenerativa, por defecto en las ramas, esta ACTIVADA. Se puede cambiar la opcion en "IMAGE_GEN_ACTIVE=true" dentro del .env,
    ```
    IMAGE_GEN_ACTIVE=true
    ``````
3. El numero de post pot sub topico, esta definido en el .env. Por defecto son 2.
    ```
        NUM_POSTS_PER_TOPIC=2
    ``````

node createPostsV2.js
node instagramUpload.js

or

node createPostV2.js && node instagramUpload.js