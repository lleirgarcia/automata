const { OpenAI } = require("openai");
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function generatePrompt(prompt) {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4-0613",
    });

    return chatCompletion.choices[0].message.content;
}

exports.generatePrompt = generatePrompt;