const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg-static');
require('dotenv').config();

const { spawn } = require('child_process');
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const videoUrl = 'https://www.youtube.com/watch?v=RmEUBS5wT10';

function getAudioStream(videoUrl) {
 Promise((resolve, reject) => {
    const videoStream = ytdl(videoUrl, { quality: 'highest' });
    const ffmpegCommand = `${ffmpeg} -i pipe:0 -vn -acodec libmp3lame -ac 2 -ab 160k -ar 48000 pipe:1`;
    const ffmpegProcess = spawn(ffmpegCommand, { shell: true, stdio: ['pipe', 'pipe', 'inherit'] });

    videoStream.pipe(ffmpegProcess.stdin);
    ffmpegProcess.stdout.on('error', (error) => {
      console.error('FFmpeg error:', error);
      reject(error);
    });

    resolve(ffmpegProcess.stdout);
  });
}

async function transcribeAudioAndSaveToFile(audioStream) {
  const resp = await openai.createTranscription(audioStream, "whisper-1");

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "summarize the following text into a blog post with sections and return in markdown:" + resp.data.text,
    temperature: 0.7,
    max_tokens: 1383,
  });

  const completionText = completion.data.choices[0].text;

  console.log(completionText, "############## completion ##############");

  const fs = require('fs');
  const folderName = 'summary';
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }

  fs.writeFile(`./${folderName}/transcription.md`, completionText, 'utf8', function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log('Transcription saved to transcription.md');
    }
  });
}

async function main() {
  try {
    const audioStream = await getAudioStream(videoUrl);
    await transcribeAudioAndSaveToFile(audioStream);
    console.log('Transcription complete!');
  } catch (error) {
    console.error(error);
  }
}

main();

