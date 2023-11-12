# A U T O M A T A


# next steps
- [x] generar posts para Instagram desde 1 tema generico y un sub tema.
- [x] hacer esto cada X veces (segun los temas y subtemas de un JSON y X veces por cada tema)
- [x] de los posts genero prompts a modo de historias para autogenerar imagenes para los posts
- [x] guardo imagenes en el host y las enlazo por cada posts segun un ID
- [x] prueba de subida de posts a instagram
- [x] subir desde el host a instagram lo que hay el local
- [] gestion de token desde el propio codigo
- [] programar las subidas
    - [] Jenkins Docker en local siempre levantado
- [] lo mismo de instagram, para twitter
- [] crear un JSON también en Españo, para una cuenta tmb española
    - [] revisar si hacerlo en la misma llamada o una vez tienes el JSON en ingles, leerlo y pasarlo al español.

- [x] subir las imagenes a un aws o por el estilo https://aws.amazon.com/es/s3/
    - luego de alli tenerlas disponibles
    - !! las subimos  a github (en el futuro mirar s3)


# problemas
- [x] revisar pq las imagenes se guardan las JPG con un prefix "png", eso hace que la url del final no se guarda correctamente.
    - parece que el pat tenia /imagenes/pm${id}.png
- [x] parece que al recuperar la imagen desde Github hay algun problemilla, parece que hay un proxi para permitir la imagen en raw.
    esta url sale: https://github.com/lleirgarcia/automata/blob/develop/imagenes/png/8wE09mxPKw.png?raw=true
- [x] revisar pq la subida a facebook no tira (quizas es por el punto de arriba)

- [] ideas.
    - [] hacer otra cuenta y meter videos de llados.
    - [] ver como de manera automatica puedo autogenerar clips de youtube.
    - [] transcribir esos clips y generar texto pasa instagram o twitter.
    - [] motivacion: automatizar la recogida de clips y autogeneracion de contenido de Llados y esta peña
    



# execution

1. Take a look in topicsandsubtopics.json to define Topics and Sub topics.
2. La imagen autogenerativa, por defecto en las ramas, esta ACTIVADA. Se puede cambiar la opcion en "IMAGE_GEN_ACTIVE=true" dentro del .env,
````
IMAGE_GEN_ACTIVE=true
````

3. El numero de post pot sub topico, esta definido en el .env. Por defecto son 2.
````
NUM_POSTS_PER_TOPIC=2
````

node createPostsV2.js
node instagramUpload.js

or

node createPostV2.js && node instagramUpload.js

# ENVIRONMENT VARIABLES
#OPENAI
OPENAI_API_KEY={openai_key}
NUM_POSTS_PER_TOPIC={number_of_posts_to_generate}
IMAGE_GEN_ACTIVE=true

#INSTAGRAM
ONLYHABITS_ID={ig_user_id}
ACCES_TOKEN={access_token}
