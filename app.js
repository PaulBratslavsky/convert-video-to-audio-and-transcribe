const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');

const videoUrl = 'https://www.youtube.com/watch?v=RmEUBS5wT10';
const folderName = 'videos';



function downloadVideo(folderName, videoUrl, fileName) {

  const outputFile = path.join(folderName, fileName);

  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }

  const videoStream = ytdl(videoUrl, { quality: 'highest' });
  videoStream.pipe(fs.createWriteStream(outputFile));

  videoStream.on('finish', () => {
    console.log('Video downloaded!');
  });
}

downloadVideo(folderName, videoUrl, "test.mp4");

