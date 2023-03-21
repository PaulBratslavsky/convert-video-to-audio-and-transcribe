const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg-static');
const { spawn } = require('child_process');

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
      fs.unlinkSync(inputFile); // remove the original video file
      resolve();
    });
  });
}

async function main() {
  try {
    await downloadVideo(folderName, videoUrl, 'test.mp4');
    console.log('Conversion complete!');
  } catch (error) {
    console.error(error);
  }
}

main();
