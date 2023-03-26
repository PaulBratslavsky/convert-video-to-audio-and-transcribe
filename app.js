const fs = require('fs');
const os = require('os');
const path = require('path');
const ytdl = require('ytdl-core');
const ffmpegPath = require('ffmpeg-static');
require('dotenv').config();
const ffmpeg = require('fluent-ffmpeg');

// Set the path to the FFmpeg executable
ffmpeg.setFfmpegPath(ffmpegPath);


const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const videoUrl = 'https://www.youtube.com/watch?v=RmEUBS5wT10';

async function downloadVideo(videoUrl, fileName) {
  const outputFile = path.join(os.tmpdir(), fileName);
  const videoStream = ytdl(videoUrl, { quality: 'highest' });
  const writeStream = fs.createWriteStream(outputFile);

  return new Promise((resolve, reject) => {
    videoStream.pipe(writeStream);
    videoStream.on('finish', () => {
      console.log('Video downloaded!');
      resolve(outputFile);
    });

    videoStream.on('error', (error) => {
      reject(error);
    });
  });
}

async function convertVideoToAudio(videoFilePath) {
  const outputFile = path.join(os.tmpdir(), `${path.parse(videoFilePath).name}.mp3`);

  return new Promise((resolve, reject) => {
    ffmpeg(videoFilePath)
      .outputOptions([
        '-vn',
        '-acodec', 'libmp3lame',
        '-ac', '2',
        '-ab', '160k',
        '-ar', '48000'
      ])
      .save(outputFile)
      .on('error', (error) => {
        console.error('FFmpeg error:', error);
        reject(error);
      })
      .on('end', () => {
        console.log('FFmpeg process completed');
        fs.unlinkSync(videoFilePath); // remove the temporary video file
        resolve(outputFile);
      });
  });
}


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
async function main() {
  try {
    console.log('Starting video download...')
    const videoFileName = 'test.mp4';
    const tempVideoPath = await downloadVideo(videoUrl, videoFileName);
    console.log('Video downloaded...')

    console.log('Starting audio conversion...')
    const tempAudioPath = await convertVideoToAudio(tempVideoPath);
    console.log('Audio conversion complete!')
    
    console.log('Starting transcription...')
    await transcribeAudioAndSaveToFile(tempAudioPath, videoFileName);
    fs.unlinkSync(tempAudioPath); // remove the temporary audio file
    console.log('Transcription complete!');
  } catch (error) {
    console.error(error);
  }
}

main();





