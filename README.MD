# A U T O M A T A


# next steps (todo list)
- [x] generar posts para Instagram desde 1 tema generico y un sub tema.
- [x] hacer esto cada X veces (segun los temas y subtemas de un JSON y X veces por cada tema)
- [x] de los posts genero prompts a modo de historias para autogenerar imagenes para los posts
- [x] guardo imagenes en el host y las enlazo por cada posts segun un ID
- [x] prueba de subida de posts a instagram
- [x] subir desde el host a instagram lo que hay el local

# by priority
- [x] gestion de token desde el propio codigo
    - revisar si esto funciona (https://www.youtube.com/watch?v=eIeDKLCgP6A)
- [] programar las subidas
    - [] Git hub actions (esta en un chat de gpt)
    - [] estoy en ello, me queda poner el API key de OpenIA en algun sitio
        para poder ejecutar 
        Lo mismo con IG.
- [] contabilizador de imagenes generadas
    - hacer un registro diario de imagenes que se autogeneran
    - hacer un registro diario de prompts que se autogeneran
    - esto me servirá para conocer mis gastos
- [] manejar subidas. si quiero subir 6 veces al dia, como lo gestiono? 
    - estaría guay tener generado por ejemplo 100 posts y que estos se vayan subiendo de a poco (genero 100 y subo cada X horas)
        - aqui necesitaría un control de que el post q estoy subiendo tenga un check (en el JSON?)
    - tmb molaria que estos se fueran generando de a poco de forma automatica (genero post y lo subo cada X, genero y subo cada X)


- [] crear un JSON también en Español, para una cuenta tmb española
    - [] revisar si hacerlo en la misma llamada o una vez tienes el JSON en ingles, leerlo y pasarlo al español.
- [] crear un historico de posts. la idea es que los nuevos posts no se vayan repitiendo con el paso del tiempo con lo cual estaría genial poder 
    tenerlos en cuenta (hay q ver los tokens) para re leerlos y crear a partir de alli 
- [] lo mismo de instagram, para twitter

- [x] subir las imagenes a un aws o por el estilo https://aws.amazon.com/es/s3/
    - luego de alli tenerlas disponibles
    - !! las subimos  a github (en el futuro mirar s3)


# problemas
- [x] revisar pq las imagenes se guardan las JPG con un prefix "png", eso hace que la url del final no se guarda correctamente.
    - parece que el pat tenia /imagenes/pm${id}.png
- [x] parece que al recuperar la imagen desde Github hay algun problemilla, parece que hay un proxi para permitir la imagen en raw.
    esta url sale: https://github.com/lleirgarcia/automata/blob/develop/imagenes/png/8wE09mxPKw.png?raw=true
- [x] revisar pq la subida a facebook no tira (quizas es por el punto de arriba)

# ideas
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



## ultimo resumen
he metido un acces token de github para poder ejecutar desde el repositorio.
ojo al ejecutarlo en local pq se desconfigura el url y no me deja subir.
si sucede ejecutar:
    git remote -v  
    git remote set-url origin git@github.com:lleirgarcia/automata.git    

* parece q esto no esta tirando bien, revisar
* revisar tokens y ariables en .env y secrets del actions



