const { OpenAI } = require("openai");
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: "Escribeme una historia bonita de 300 palabras." }],
            model: "gpt-3.5-turbo",
            max_tokens:200,
        });

        // Mostrar la respuesta en la consola
        console.log(chatCompletion.choices[0]);

    } catch (error) {
        console.error("Error al obtener la respuesta de OpenAI:", error);
    }
}

main();
