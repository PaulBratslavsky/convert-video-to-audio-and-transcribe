const fs = require('fs');
const path = require('path');
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
const folderName = 'video';

function downloadVideo(folderName, videoUrl, fileName) {
  return new Promise((resolve, reject) => {
    const outputFile = path.join(folderName, fileName);

    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }

    const videoStream = ytdl(videoUrl, { quality: 'highest' });
    videoStream.pipe(fs.createWriteStream(outputFile));

    videoStream.on('finish', () => {
      console.log('Video downloaded!');
      convertVideoToAudio(folderName, fileName, 'audio')
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });

    videoStream.on('error', (error) => {
      reject(error);
    });
  });
}

function convertVideoToAudio(folderName, fileName, outputFolderName) {
  return new Promise((resolve, reject) => {
    const inputFile = path.join(folderName, fileName);
    const outputFile = path.join(outputFolderName, `${path.parse(fileName).name}.mp3`);
    const command = ffmpeg + ' -i ' + inputFile + ' -vn -acodec libmp3lame -ac 2 -ab 160k -ar 48000 ' + outputFile;

    if (!fs.existsSync(outputFolderName)) {
      fs.mkdirSync(outputFolderName);
    }

    const ffmpegProcess = spawn(command, { shell: true });
    ffmpegProcess.on('error', (error) => {
      console.error('FFmpeg error:', error);
      reject(error);
    });
    ffmpegProcess.on('close', (code) => {
      console.log(`FFmpeg process exited with code ${code}`);
      // fs.unlinkSync(inputFile); // remove the original video file
      resolve();
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
    const fileName = 'test.mp4';
    await downloadVideo(folderName, videoUrl, fileName);
    console.log('Conversion complete!');

    const audioFileName = `${path.parse(fileName).name}.mp3`;
    const audioFilePath = path.join('audio', audioFileName);
    await transcribeAudioAndSaveToFile
      (audioFilePath, folderName, fileName);
    console.log('Transcription complete!');
  } catch (error) {
    console.error(error);
  }
}

main();



