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
const folderName = 'videos';

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
  console.log(resp);
  
  // const resp2 = await openai.createCompletion({
  //   engine: 'davinci',
  //   prompt: '`Transcribe the following audio file`:',
  //   file: audioFile,
  //   maxTokens: 2048,
  //   n: 1,
  //   stop: ['[SPEAKER]']
  // });
  // console.log(resp);

  // const transcription = resp2.choices[0].text.trim();
  // const paragraphs = transcription.split('\n\n');
  // const textWithTimeCodes = paragraphs.map(p => {
  //   const [startTime, endTime] = p.match(/\[.*?\]/g).map(t => t.slice(1, -1));
  //   const text = p.replace(/\[.*?\]/g, '').trim();
  //   return `${text} [${startTime} - ${endTime}]`;
  // }).join('\n');

  // fs.writeFileSync("test", textWithTimeCodes);

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



