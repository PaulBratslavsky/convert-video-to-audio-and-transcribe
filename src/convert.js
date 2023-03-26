const os = require('os');
const fs = require('fs');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);

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

module.exports = convertVideoToAudio;
