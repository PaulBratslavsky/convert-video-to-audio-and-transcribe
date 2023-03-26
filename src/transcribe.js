const fs = require('fs');
require('dotenv').config();

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function transcribeAudioAndSaveToFile(fileLocation, folderName, fileName) {
  const audioFile = fs.createReadStream(fileLocation);

  const resp = await openai.createTranscription(audioFile, "whisper-1");

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "summarize the following text into a blog post with sections and return in markdown:" + resp.data.text,
    temperature: 0.7,
    max_tokens: 1383,
  });

  const completionText = completion.data.choices[0].text;

  console.log(completion.data.choices[0].text, "############## completion ##############");

  const folderName2 = 'summary';
  if (!fs.existsSync(folderName2)) {
    fs.mkdirSync(folderName2);
  }

  fs.writeFile(`./${folderName2}/transcription.md`, completionText, 'utf8', function (err) {

  });

  // console.log(transcription
}

module.exports = transcribeAudioAndSaveToFile;
