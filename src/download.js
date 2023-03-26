const os = require('os');
const path = require('path');
const ytdl = require('ytdl-core');
const fs = require('fs');

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

module.exports = downloadVideo;
