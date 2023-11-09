const { OpenAI } = require("openai");
const { json } = require("stream/consumers");
const fs = require('fs').promises;
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


async function generateImage(prompt) {
    if(prompt) {
        console.log("...Generando imagen con prompt...")
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            quality: "hd"
        });
        return response.data[0].url;
    } else {
        console.log("No prompt.")
    }
}

exports.generateImage = generateImage;